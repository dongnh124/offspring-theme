const path = require("path")

// webpack
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const rootDir = path.resolve(__dirname)

module.exports = {
  entry: {
    main: path.resolve(rootDir, 'index.js'),
  },
  output: {
    path: path.resolve(rootDir, 'assets'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
    }),
    new webpack.DefinePlugin({
      LINK_FETCH: JSON.stringify('https://95f6e669e632.ngrok.io'),
    }),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
          },
        }
      }),
      new CssMinimizerPlugin(),
    ],
  },
  resolve: {
    extensions: [ '.js', '.jsx', '.css', '.scss', '.sass' ],
    modules: [ 'node_modules' ]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-env', '@babel/preset-react' ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-optional-chaining',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      }
    ],
  },
  // watchOptions: {
  //   aggregateTimeout: 5000,
  //   poll: 1000,
  // },
  mode: 'production',
  // mode: 'development',
  // devtool: "inline-source-map",
  watch: true,
}
