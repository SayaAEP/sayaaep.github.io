const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        index: './src/public/js/index.js',
    },
    output: {
        filename: 'assets/js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    isProd ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.(gif|png|jpg|jpeg|svg|ico|webp)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/img/[name][ext]'
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: { minimize: isProd },
            },
            {
                test: /\.woff$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/font/[name][ext]'
                }
            },
        ],
    },
    devServer: {
        port: 8080,
        hot: true,
        historyApiFallback: true,
    },
    plugins: [
        ...(isProd ? [new MiniCssExtractPlugin({ filename: 'assets/css/[name].css' })] : []),
        // Copy public/img/ to dist/assets/img/
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/public/img', to: 'assets/img' },
            ],
        }),
        // Copy metadata to dist/
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/metadata', to: 'metadata' },
            ],
        }),
        // Copy discord_card folder to dist/ (standalone iframe)
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/discord_card', to: 'discord_card' },
            ],
        }),
        // Copy CNAME, .nojekyll, LICENSE
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/CNAME', to: '[name]' },
                { from: 'src/.nojekyll', to: '[name]' },
                { from: 'src/LICENSE', to: '[name]' },
            ],
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['index'],
        }),
    ],
    mode: isProd ? 'production' : 'development',
};