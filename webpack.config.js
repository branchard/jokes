const path = require('path');

module.exports = {
    entry: './src/react/app.js',
    output: {
        path: path.resolve('./assets/js'),
        filename: 'admin.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: 'babel-loader'
            }
        ]
    }
};
