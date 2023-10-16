/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
        path: path.resolve(__dirname, 'zzjz-file-server'),
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
                { from: "./prod-env", to: "./conf" },
                { from: "./public/log/logs.log", to: "./public/log" }
            ],
        }),
        new ForkTsCheckerWebpackPlugin(),
    ],
};