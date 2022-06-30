Package.describe({
  name: 'moxb:file-mirror-service',
  version: '0.0.10',
  summary: 'Service to maintain and access a mirrored cache of remote files',
    git: 'https://github.com/moxb/moxb/tree/master/meteor/packages/file-mirror-service',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('2.7.3');
  api.use('ecmascript');
  api.use('typescript');
  api.use('ostrio:files@2.2.1');
  api.mainModule('api/index.ts', "client");
  api.mainModule('server/index.ts', "server");
});

Npm.depends({
    "tslib": '2.4.0',
    "mobx": '6.5.0',
    "uuid": '8.3.2', // required by mobx
    "@moxb/moxb": '0.3.28',
    "@moxb/meteor": '0.3.32'
});
