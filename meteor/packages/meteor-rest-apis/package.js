Package.describe({
    name: 'moxb:meteor-rest-apis',
    version: '0.0.8',
    summary: 'Make it easy to define and consume HTTP REST APIs in Meteor apps',
    git: '',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('2.7.3');
    api.use('ecmascript');
    api.use('typescript');
    api.use('simple:authenticate-user-by-token@1.2.1');
    api.use('simple:json-routes@2.3.1');
    api.use('simple:rest@1.2.1');
    api.use('simple:rest-accounts-password@1.2.1');
    api.use('simple:rest-bearer-token-parser@1.1.1');
    api.use('simple:rest-json-error-handler@1.1.1');

    api.mainModule('index.ts', 'client');
    api.mainModule('server.ts', 'server');

});

Npm.depends({
    "tslib": '2.4.0',
    "mobx": '6.5.0',
    "uuid": '8.3.2', // required by mobx
    "@moxb/moxb": '0.3.72',
    "@moxb/meteor": '0.3.72'
});
