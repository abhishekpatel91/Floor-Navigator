import path from 'path';
import webpack from 'webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import FixDefaultImportPlugin from 'webpack-fix-default-import-plugin';
import merge from 'webpack-merge';

const babelOptions = {
    presets: [
        [
            'env',
            {
                modules: false
            }
        ],
        'stage-2',
        'react'
    ],
    plugins: [
    ]
};

export const getBabelOptions = (mode) => {
    if (mode === 'development') {
        return {
            ...babelOptions,
            plugins: [
                ...babelOptions.plugins,
                'react-hot-loader/babel'
            ]
        }
    }
    return babelOptions;
}

const plugins = [
    new HTMLWebpackPlugin({
        template: './src/index.html',
    }),
    new CleanWebpackPlugin(['dist'], {
        verbose: true,
        root: process.cwd()
    }),
    new FixDefaultImportPlugin(),
];

const common = {
    entry: {
        app: './src/index.jsx'
    },
    output: {
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].chunk.js',
        path: path.resolve('./dist'),
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.scss'],
        modules: [path.resolve('./src'), 'node_modules'],
        alias: {
            src: path.resolve('./src')
        }
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader' // creates style nodes from JS strings
                }, {
                    loader: 'css-loader' // translates CSS into CommonJS
                }, {
                    loader: 'sass-loader' // compiles Sass to CSS
                }]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192, // settings the limit to 8 KB
                        fallback: 'file-loader',
                        name: '[name].[ext]',
                        outputPath: 'assets/fonts'
                    }
                }
            },
            {
                test: /\.(png|jpeg|jpg|gif|webp)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192, // settings the limit to 8 KB
                        fallback: 'file-loader',
                        name: '[name].[ext]',
                        outputPath: 'assets/images'
                    }
                }
            },
        ]
    },
    plugins,
}

const devConfig = merge.smart(common, {
    mode: 'development',
    output: {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: getBabelOptions('development')
                    },
                ],
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            __DEV__: true,
            __PROD__: false,
        }),
    ],
    devServer: {
        hot: true,
        historyApiFallback: true,
        disableHostCheck: true,
        host: '0.0.0.0',
        inline: true,
        open: true,
    }
})

const prodConfig = merge.smart(common, {
    mode: 'production',
    devtool: 'none',
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: {
            name: 'manifest'
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [{
                    loader: 'babel-loader',
                    options: getBabelOptions('production')
                }],
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DefinePlugin({
            __DEV__: false,
            __PROD__: true,
        }),
    ]
});

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

export default config;