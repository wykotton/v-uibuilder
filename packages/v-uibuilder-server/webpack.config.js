/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require("fs");
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const npm_lifecycle_event = process.env?.npm_lifecycle_event
// const env = npm_lifecycle_event.indexOf('build') !== -1 ? 'production' : 'development'
// const mode = env === 'production' ? npm_lifecycle_event.slice(6) : '' 
const mode = process.env?.npm_lifecycle_event.slice(6) || "prod";
const CopyConfig = mode === 'prod' ? { from: "./env-prod", to: "./conf" } : { from: "./env-test", to: "./conf" }
const buildconfig = function() {
    if (mode !== 'prod') return
    fs.readFile(path.resolve(__dirname, `./env-${mode}/ui-config.json`), 'utf-8', function(err, data) {
        if (err) {
            throw new Error('读取配置文件失败...');
        }
        const config = JSON.parse(data)
        const version = config.version.substr(0, config.version.lastIndexOf('.')) + '.' + (Number(config.version.substr(config.version.lastIndexOf('.') + 1)) + 1)
        config.version = version
        fs.writeFile(path.resolve(__dirname, `./zzjz-uibuilder-server/${version}`), JSON.stringify(config), function (err) {
            if (err) {
                throw new Error('保存配置文件失败...');
            }
        });
    });
}
buildconfig()

console.log('start build');
module.exports = {
    entry: './src/main',
    target: 'node',
    externals: {},
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: {
                    loader: 'ts-loader',
                    options: { transpileOnly: true },
                },
                exclude: /node_modules/
            }
        ]
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'zzjz-uibuilder-server'),
    },
    resolve: {
        extensions: ['.js', '.ts', '.json'],
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "#": path.resolve(__dirname, "./conf"),
            "$": path.resolve(__dirname, "./page")
        }
    },
    plugins: [
        new webpack.IgnorePlugin({
            checkResource(resource) {
                const lazyImports = [
                    '@nestjs/microservices',
                    '@nestjs/microservices/microservices-module',
                    'cache-manager',
                    'class-validator',
                    'class-transformer/storage',
                ];
                if (!lazyImports.includes(resource)) {
                    return false;
                }
                try {
                    require.resolve(resource, {
                        paths: [process.cwd()],
                    });
                } catch (err) {
                    return true;
                }
                return false;
            },
        }),
        new CopyWebpackPlugin({
            patterns: [
                CopyConfig,
                { from: "./public/log/logs.log", to: "./public/log" }
            ],
        }),
        new ForkTsCheckerWebpackPlugin()
    ],
};


