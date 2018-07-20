module.exports = {
    entry: './semui/index.tsx',
    output: {
        path: __dirname + '/semui',
        filename: 'js/index.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    }
};
