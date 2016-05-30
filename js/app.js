'use strict';

// Returns a new notification ID used in the notification.
function getNotificationId() {
  var id = Math.floor(Math.random() * 9007199254740992) + 1;
  return id.toString();
}

function notifyProjects(projects, icon, title, message) {
  projects.forEach(function(project, i) {
    const msg = `${project.name} ${message}`;
    const notificationOptions = {
      type: 'basic',
      iconUrl: icon,
      title: `${project.name} #${project.lastBuildLabel} ${title}`,
      message: msg
    };
    chrome.notifications.create(getNotificationId(), notificationOptions, function() {});
    console.log(`${project.name} #${project.lastBuildLabel} ${message}`);
  });
}

function appendProject(project, i) {
  let id = 'project-' + i;
  let serverId = project.server.id;

  let culprits = '';
  if (project.culprits) {
    culprits = 'Culprits: ' + project.culprits;
  }

  let projTemplate =
    `<a class="col s4 projtooltipped" href="${project.webUrl}" target="_blank" data-tooltip="[${serverId}] ${project.name} - Status: ${project.lastBuildStatus} - Activity: ${project.activity} - Last Build: ${project.lastBuildTime}">
      <div id="${id}" style="position: relative;" class="z-depth-2 project ${project.lastBuildStatus} ${project.activity}">
        <p class="project-name"><b>${project.name}</b> #${project.lastBuildLabel}</p>
        <span style="margin: 0;" class="truncate">${culprits}</span>
        <span style="margin: 0; position: absolute; bottom: 0; left: 0; transform-origin: left; transform: translate(15%,0);">Last build: ${project.lastBuildTime}</span>
      </div>
    </a>`;

  $('#projects').append(projTemplate);
}

function parseBambooProject(server, proj, i) {
  let name = $(proj).children('title').text();
  let webUrl = $(proj).children('link').text();
  let lastBuildLabel = 'Unknown';
  let lastBuildStatus = 'Unknown';
  let culprits = null;

  let match = null;
  if (match = /(.*)-(.*)\s+was\s+SUCCESSFUL\s+/.exec(name)) {
    name = match[1];
    lastBuildLabel = match[2];
    lastBuildStatus = 'Success';
  } else if (match = /(.*)-(.*)\s+has\s+FAILED\s+/.exec(name)) {
    name = match[1];
    lastBuildLabel = match[2];
    lastBuildStatus = 'Failure';
    if (match = /(.*)-(.*)\s+has\s+FAILED\s+.*\s+Updated\s+by\s+(.*)/.exec(name)) {
      culprits = match[3];
    }
  }

  let activity = 'Sleeping';
  let lastBuildTime = moment($(proj).children('dc\\:date').text()).fromNow();

  return {
    'server': server,
    'name': name,
    'webUrl': webUrl,
    'lastBuildStatus' : lastBuildStatus,
    'lastBuildLabel': lastBuildLabel,
    'lastBuildTime': lastBuildTime,
    'activity': activity,
    'culprits': culprits
  };
}

function parseCCProject(server, proj, i) {
  let name = $(proj).attr('name');
  let webUrl = $(proj).attr('webUrl');
  let lastBuildLabel = $(proj).attr('lastBuildLabel') || 'Unknown';
  let lastBuildTime = moment($(proj).attr('lastBuildTime') || null).fromNow();
  let lastBuildStatus = $(proj).attr('lastBuildStatus') || 'Unknown';
  let activity = $(proj).attr('activity') || 'Sleeping';
  let culprits = null;

  return {
    'server': server,
    'name': name,
    'webUrl': webUrl,
    'lastBuildStatus' : lastBuildStatus,
    'lastBuildLabel': lastBuildLabel,
    'lastBuildTime': lastBuildTime,
    'activity': activity,
    'culprits': culprits
  };
}

let tasks = [];

function createTasks(config) {
  tasks = [];

  // iterate over the list of servers
  config.servers.forEach(function(server) {
    let feedUrl = server.baseUrl + '/' + server.path;

    tasks.push(function(callback) {
      $.ajax(feedUrl, {
          success: function(data) {
            callback(null, {server: server, data: data});
          },
          error: function(xhr, status, error) {
            let data =
              `<Projects>
                <Project name="${status} [${feedUrl}]" activity="Error" lastBuildStatus="Error" lastBuildLabel="unknown" lastBuildTime="" webUrl="${feedUrl}"/>
              </Projects>`;

            callback(null, {server: server, data: data});
          }
        }
      );
    });
  });
}

function pollServers() {
  console.log('tick');
  async.parallel(tasks, function(err, results) {
    let projects = [];

    if (!err) {
      $('#projects').empty();
      for (let i in results) {
        let res = results[i];
        if (res.server.type === 'bamboo') {
          $('item', res.data).each(function(i) {
            projects.push(parseBambooProject(res.server, this, i));
          });
        } else {
          $('Project', res.data).each(function(i) {
            projects.push(parseCCProject(res.server, this, i));
          });
        }
      }
    } else {
      console.log(err);
    }

    // sort alphabetically
    projects.sort(function(a, b) {
      let aname = a.name || 'unknown';
      let bname = b.name || 'unknown';
      aname = aname.toLocaleLowerCase();
      bname = bname.toLocaleLowerCase();

      if (aname < bname) return -1;
      if (aname > bname) return 1;
      return 0;
    });

    projects.forEach(function(project, i) {
      appendProject(project, i);
    });

    $('.project-name').squishy({maxSize : 20});
    // Occasionally squishy doesn't seem to work on first load, so trigger
    // it into action by faking a resize event
    $(window).resize();

    $('.projtooltipped').tooltip({delay: 800});

    console.log('tock');

    chromeStorage.get('states').then(result => {
      let notifySucceeded = [];
      let notifyFailed = [];
      let notifyFailedAgain = [];

      let success = 0;
      let building = 0;
      let failure = 0;

      const states = {};

      let previousStates = result.states || {};

      projects.forEach(function(project, i) {
        const previousState = previousStates[project.webUrl];
        if (previousState) {
          if ((previousState.lastBuildStatus === 'Success') && (project.lastBuildStatus !== 'Success')) {
            // The simplest case. The last status was 'Success' and the current status is not 'Success'
            notifyFailed.push(project);
          } else if (previousState.lastBuildStatus === 'Failure') {
            if (project.lastBuildStatus === 'Success') {
              // The last status was 'Failure' and the current status is 'Success'
              notifySucceeded.push(project);
            } else if (project.lastBuildLabel !== previousState.lastBuildLabel) {
              // The last status was 'Failure' and a new build - just finished - failed again
              notifyFailedAgain.push(project);
            }
          }
        }

        if (project.activity === 'Building') {
          building = building + 1;
        } else if (project.lastBuildStatus === 'Success') {
          success = success + 1;
        } else if (project.lastBuildStatus === 'Failure') {
          failure = failure + 1;
        }

        states[project.webUrl] = project;
      });

      let summaryTemplate =
        `<span class="summary-success"><i class="material-icons">sentiment_satisfied</i> ${success}</span><span class="summary-building"><i class="material-icons">directions_run</i> ${building}</span><span class="summary-failure"><i class="material-icons">sentiment_dissatisfied</i> ${failure}</span>`;
        $('#summary').html(summaryTemplate);

      if (notifySucceeded.length > 0) {
        notifyProjects(notifySucceeded, 'images/ci-success-128.png', 'build fixed!', 'was previously broken but is now fixed!');
      }
      if (notifyFailed.length > 0) {
        notifyProjects(notifyFailed, 'images/ci-failed-128.png', 'build broken!', 'is now broken!');
      }
      if (notifyFailedAgain.length > 0) {
        notifyProjects(notifyFailedAgain, 'images/ci-failed-128.png', 'build still broken!', 'was previoulsy broken and is still broken!');
      }

      chromeStorage.set({'states': states}).then(() => {
        // nothing to do
      });
    });
  });
}

// this is not a proper web application so we disable proper form submission
$('form').submit(false);

let mainTimer;

function main() {
  chromeStorage.get('config').then(result => {
    let config = result.config;
    if (!config || !config.servers) {
      console.log('Setting config using defaults');
      config = defaultConfig;
    }

    createTasks(config);
    pollServers();

    mainTimer = setTimeout(main, 60 * 1000);

    chromeStorage.set({'config': config}).then(() => {
      // nothing to do
    });
  });
}

// many things could have happened since we were last running so ignore
// previously saved states...
chromeStorage.set({'states': {}}).then(() => {
  main(); // ... and start er up!
});
