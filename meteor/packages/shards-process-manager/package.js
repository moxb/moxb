Package.describe({
    name: 'moxb:shards-process-manager',
    version: '0.0.3',
    // Brief, one-line summary of the package.
    summary: 'A way to run background processing via worker meteor nodes',
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
    api.use('moxb:meteor@0.0.2');
    api.mainModule('client/index.ts', 'client');
    api.mainModule('server/index.ts', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('moxb:shards-process-manager');
  api.mainModule('shards-process-manager-tests.js');
});
