'use strict';

module.exports = {"servers" : [
  {
    "id": "Apache",
    "type": "cctray",
    "baseUrl": "https://builds.apache.org",
    "path": "cc.xml"
  },
  {
    "id": "Netbeans",
    "type": "cctray",
    "baseUrl": "http://deadlock.netbeans.org/hudson",
    "path": "cc.xml"
  },
  {
    "id": "SpringSource",
    "baseUrl": "https://build.springsource.org/",
    "type": "bamboo",
    "path": "rss/createAllBuildsRssFeed.action?feedType=rssAll"
  }
],
"sounds": {
  "theme": "simpsons"
}};
