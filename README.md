ci-dashboard-chrome-app
=======================

A Chrome application that aggregates build status from multiple continuous integration servers and radiates (fun!) notifications of build events.

## Why do we need it?

I've found it to be pretty common for many places to be running more than one type of continuous integration server or even multiple servers of the same type. Keeping any eye on multiple CI servers can be a lot of effort as each type of server supports a different set of tools (email, slack, jabber, etc) to provide notification of build events.

It would be great to have a single dashboard that aggregates over multiple ci servers! And this app makes it possible!

Another common issue I've found with CI notification systems is that their often subtle notifications tend to get ignored, resulting in such systems becoming ["information refrigerators"](http://c2.com/cgi/wiki?InformationRefrigerator) rather than ["information radiators"](http://c2.com/cgi/wiki?InformationRadiator). This app attempts to address this problem via:

* native desktop notifications
* short summaries of the last build events
* audible and fun sounds per significant build events

## Install

This app is a [Chrome app](https://developer.chrome.com/apps/about_apps) and therefore Chrome needs to be installed before this app can be installed.

I'm still debating if it is worth the effort to publish the app in the Chrome store, but for now you have to install it manually:

1. Clone this repo or download a zip of the repo

    git clone https://github.com/robertmaldon/ci-dashboard-chrome-app.git

2. Enable Chrome extensions "Developer mode"

    a) Go to chrome://extensions/

    b) Check "Developer mode"

3. Load the app as an unpacked extension

    a) Click the "Load unpacked extension..." button

    b) Navigate to the local file system location where the ci-dashboard-chrome-app repo was clones/unzipped

    c) Click the "Select" button

    d) Click the "Launch" link in the "ci-dashboard" section of the extensions list

## Configuration

To configure ci-dashboard - including the CI servers it collects build status from - click the hamburger menu on the top right.

A few sample CI servers are configured by default. Feel free to remove them.

## Feed formats

This app supports build status collection from various types of feeds:

### (cctray) Cruise Control

[Cruise Control](https://en.wikipedia.org/wiki/CruiseControl) was the grandfather of most modern continuous integration servers.

These days you're unlikely to find anybody using Cruise Control, but one of it's feed formats - often referred to as ["cctray" feed format](CCTRAY_FEED_FORMAT.md) - is implemented in most modern continuous integration servers.

Sample cctray URLs for various continuous integration servers:

* [Buildkite](https://buildkite.com/) - https://cc.buildkite.com/my-organisation.xml?access_token=0123abcdefg
* [CruiseControl](http://cruisecontrol.sourceforge.net/) - http://cc.java.servername:8080/cctray.xml
* [CruiseControl.rb](http://cruisecontrolrb.thoughtworks.com/) - http://cc.rb.servername:3333/XmlStatusReport.aspx
* [CruiseControl.NET](http://ccnet.thoughtworks.com/) - http://cc.net.servername/XmlStatusReport.aspx
* [Hudson](https://hudson.dev.java.net/) - http://hudson.servername:8080/cc.xml
* [Jenkins](http://jenkins-ci.org/) - http://jenkins.servername:8080/cc.xml
* [Teamcity](http://www.jetbrains.com/teamcity/) - http://teamcity.servername:8111/httpAuth/app/rest/cctray/projects.xml
* [Travis CI](http://travis-ci.org/) - http://travis-ci.org/ownername/repositoryname/cc.xml

### (bamboo) Bamboo

[Bamboo](https://www.atlassian.com/software/bamboo) is the one major continuous integration server that does not support the cctray feed format, but it is a common enough CI server that it was a no brainer to add support for.

Bamboo has its own proprietary RSS format, an example of which can be viewed [here](https://build.springsource.org/rss/createAllBuildsRssFeed.action?feedType=rssAll). An important difference to note between the Bamboo RSS feed and a cctray feed is that the Bamboo RSS feed outputs the status of the last, say, 20 builds (it's configurable) and not the current status of all configured projects. This means that if a particular project does not build for a long time that project may "drop out" of the RSS feed until it builds again. Bummer, but that's the way it is.

Sample bamboo RSS feed url - https://build.springsource.org/rss/createAllBuildsRssFeed.action?feedType=rssAll&os_authType=basic

(NOTE: There is an [unsupported cctray plugin for Bamboo](https://marketplace.atlassian.com/plugins/com.atlassian.plugins.bamboo.cctray.cctray-bamboo-plugin/server/overview). I've never tried it.)

## Credits

This app could not have been built without the hard work of others.

* [Materialize](http://materializecss.com/) provides a fantastic implementation of Google's [Material design](https://www.google.com/design/spec/material-design/introduction.html)
* [Material icons](https://design.google.com/icons/) gives us some groovy icons
* [squishy](https://github.com/lemonmade/squishy) fits varying size project names to their container width
* [moment.js](http://momentjs.com/) gives us some nice date/time functions
* [async.js](https://github.com/caolan/async) helps us deal with javascript callback concurrency
* [chrome-storage-wrapper](https://github.com/lmk123/chrome-storage-wrapper) provides a sane promise wrapper around the [chrome.storage api](https://developer.chrome.com/extensions/storage)

# License

The MIT License (MIT)

Copyright (c) 2016 Robert Maldon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
