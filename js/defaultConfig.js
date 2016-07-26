const defaultConfig = {"servers" : [
  {
    "id": "NiB Buildkite",
    "type": "cctray",
    "baseUrl": "https://cc.buildkite.com",
    "path": "nib-health-funds-ltd.xml?access_token=0f8f4ddde091b8465c7b94440903e258bda2157d"
  },
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
  "enabled": true
}};
