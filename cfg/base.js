'use strict'

let path = require('path')
let srcPath = path.join(__dirname, '/../src')
let entry = 'http://127.0.0.1:8000'
let webpack = require('webpack')

module.exports = {
    devtool: 'source-map',
    cache: true,
    context: srcPath,
    watch: true,
    entry: [
        './index.js'
    ],
    output: {
        path: path.join(__dirname, '/../dist/assets'),
        filename: 'app.js',
        publicPath: '/assets/'
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            actions: `${srcPath}/actions`,
            components: `${srcPath}/components`,
            containers: `../src/containers`,
            reducers: `${srcPath}/reducers`,
            styles: `${srcPath}/styles`
        }
    },
    devServer: {
        contentBase: './src/',
        historyApiFallback: true,
        hot: true,
        port: 8000,
        publicPath: '/assets/',
        noInfo: false,
        headers: {
            "Access-Control-Allow-Origin": '*',
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
        }
    },
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ],
    module: {
        rules:[
            // {
            //     enforce: "pre",
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: "eslint-loader",
            // },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: srcPath,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['react', 'es2015', 'stage-0'],
                        plugins: ['transform-runtime', 'transform-decorators-legacy', 'transform-class-properties']
                    }
                }]
            },
            {
                test: /\.json$/,
                include: srcPath,
                use: ['json-loader']
            },
            {
                test: /\.css$/,
                include: srcPath,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                include: srcPath,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /mapbox-gl.+\.js$/,
                include: srcPath,
                use: ['transform/cacheable?brfs']
            }
        ]
    }
}
