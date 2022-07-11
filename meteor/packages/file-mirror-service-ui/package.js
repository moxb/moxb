Package.describe({
    name: 'moxb:file-mirror-service-ui',
    version: '0.0.6',
    summary: 'Client-side widgets for your file mirror service',
    git: 'https://github.com/moxb/moxb/tree/master/meteor/packages/file-mirror-service-ui',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('2.7.3');
    api.use('ecmascript');
    api.use('typescript');
    api.use('moxb:file-mirror-service@0.0.12');
    api.mainModule('index.ts', "client");
});

Npm.depends({
    "@moxb/moxb": '0.3.72',
    "@moxb/react-html": '0.3.73'
});
