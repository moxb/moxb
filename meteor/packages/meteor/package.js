Package.describe({
  name: 'moxb:meteor',
  version: '0.0.2',
  // Brief, one-line summary of the package.
  summary: 'Meteor integration for moxb',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('2.7.3');
  api.use('ecmascript');
  api.use('typescript');
  api.mainModule('client.ts', 'client');
  api.mainModule('server.ts', 'server');
});

Npm.depends({
    "@moxb/moxb": '0.3.22',
    "mobx": "6.5.0",
    "uuid": "8.3.2",
    "tslib": "2.4.0"
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('moxb:meteor');
  api.mainModule('moxb-meteor-tests.js');
});
