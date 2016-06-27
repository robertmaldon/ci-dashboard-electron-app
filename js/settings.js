'use strict';

function addServer(server, i) {
  if (i === undefined) {
    i = $('.server-config').length + 1;
  }

  let serverId = '';
  let serverType = '';
  let serverBaseUrl = '';
  let serverPath = '';

  if (server && !(server instanceof jQuery.Event)) {
    serverId = server.id;
    serverType = server.type;
    serverBaseUrl = server.baseUrl;
    serverPath = server.path;
  }

  let serverTemplate =
    `<div class="server-config">
      <div class="row">
        <div class="col s3 offset-s9">
          <a href="#!" class="waves-effect btn-flat server-config-delete tooltipped" data-tooltip="Delete server" style="padding: 0 10px 0 10px;"><i class="material-icons">close</i></a>
          <a href="#!" class="waves-effect btn-flat server-config-up tooltipped" data-tooltip="Move up" style="padding: 0 10px 0 10px;"><i class="material-icons">arrow_upward</i></a>
          <a href="#!" class="waves-effect btn-flat server-config-down tooltipped" data-tooltip="Move down" style="padding: 0 10px 0 10px;"><i class="material-icons">arrow_downward</i></a>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input type="text" id="server-${i}-id" class="server-id" value="${serverId}">
          <label class="active" for="server-${i}-id">Label</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s6">
          <select id="server-${i}-type" class="server-type browser-default">
    `;

  //let types = ['bamboo', 'buildkite', 'hudson', 'jenkins', 'other'];
  let types = ['bamboo', 'cctray'];

  types.forEach(function(type) {
    let selected = '';
    if (type === serverType) {
      selected = 'selected';
    }

    serverTemplate +=
      `<option value="${type}" ${selected}>${type}</option>`;
  });

  serverTemplate +=
    `     </select>
          <label class="active" for="server-${i}-type">Feed type</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input type="text" id="server-${i}-baseurl" class="server-baseurl" value="${serverBaseUrl}">
          <label class="active" for="server-${i}-baseurl">Base URL</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input type="text" id="server-${i}-path" class="server-path" value="${serverPath}">
          <label class="active" for="server-${i}-path">Path</label>
        </div>
      </div>
    </div>`;

  $('#settings-servers-list').append(serverTemplate);

  const serverConfig = $('.server-config').last();

  serverConfig.find('.server-config-delete').click(function() {
    const serverConfig = $(this).parents('.server-config');
    serverConfig.find('.tooltipped').tooltip('remove');
    serverConfig.slideUp(300, function() {
      serverConfig.remove();
    });
  });

  serverConfig.find('.server-config-up').click(function() {
    let serverConfig = $(this).parents('.server-config');

    let previousServerConfig = null;
    $('.server-config').each(function(i) {
      if ($(this).is(serverConfig) && previousServerConfig) {
        previousServerConfig.before($(this));
      }

      previousServerConfig = $(this);
    });
  });

  serverConfig.find('.server-config-down').click(function() {
    let serverConfig = $(this).parents('.server-config');

    let appendNext = false;
    $('.server-config').each(function(i) {
      if (appendNext) {
        $(this).after(serverConfig);
        appendNext = false;
      } else if ($(this).is(serverConfig)) {
        appendNext = true;
      }
    });
  });

  serverConfig.find('select').material_select();
  serverConfig.find('.modal-trigger').leanModal();
  serverConfig.find('.tooltipped').tooltip({delay: 800});
}

function showSettings() {
  chromeStorage.get('config').then(result => {
    $('#settings-servers-list').empty();
    if (result.config && result.config.servers) {
      result.config.servers.forEach(function(server, i) {
        addServer(server, i);
      });
    }
    let soundEnabled = true;
    if (result.config && result.config.sounds) {
      const soundConfig = result.config.sounds;
      soundEnabled = soundConfig.enabled;
    }
    $('#sounds-enabled').prop('checked', soundEnabled);

    $('.modal-trigger').leanModal();

    $('#main').slideUp(300);
    $('#settings').slideDown(300);
  });
}

function hideSettings() {
  $('#settings').slideUp(300);
  $('#main').slideDown(300);
}

function saveSettings() {
  const servers = [];

  $('.server-config').each(function(i) {
    const server = {};
    server['id'] = $(this).find('.server-id').val();
    server['type'] = $(this).find('.server-type').val();
    server['baseUrl'] = $(this).find('.server-baseurl').val();
    server['path'] = $(this).find('.server-path').val();

    servers.push(server);
  });

  let sounds = {};
  sounds['enabled'] = $('#sounds-enabled').is(':checked');
  audioEnabled = sounds['enabled'];

  const config = {
    'servers': servers,
    'sounds': sounds
  };

  chromeStorage.set({'config': config}).then(() => {
    hideSettings();
    clearTimeout(mainTimer);
    main();
  });
}

function resetSettings() {
  audioEnabled = true;
  chromeStorage.set({'config': defaultConfig}).then(() => {
    hideSettings();
    clearTimeout(mainTimer);
    main();
  });
}

function clearAll() {
  audioEnabled = true;
  chromeStorage.clear().then(() => {
    hideSettings();
    clearTimeout(mainTimer);
    main();
  });
}

$('#settings-open-icon').click(showSettings);
$('#add-server').click(addServer);
$('#save').click(saveSettings);
$('#cancel').click(hideSettings);
$('#reset-confirm').click(resetSettings);
$('#clear-all').click(clearAll);
