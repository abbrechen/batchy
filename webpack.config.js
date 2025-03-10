const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const HtmlInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',

  // This is necessary because Figma's 'eval' works differently than normal eval
  devtool: argv.mode === 'production' ? false : 'inline-source-map',
  entry: {
    ui: [
      './src/ui/ui.js',
      // './src/ui/js/reactivity.js',
      // './src/ui/js/export-multi.js',
      // './src/ui/js/export-single.js',
      // './src/ui/js/backend-communication.js',
      // ...glob.sync('./src/ui/js/animations/**/*.js')
      ...glob.sync('./src/ui/js/**/*.js')
    ],
    app: ['./src/app.ts'] // This is the entry point for our plugin code.
  },
  module: {
    rules: [
      // Converts TypeScript code to JavaScript
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      // Enables including CSS by doing "import './file.css'" in your TypeScript code
      // { test: /\.css$/i, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      { test: /\.(s[ac]ss|css)$/i, use: ['style-loader', 'css-loader', 'sass-loader'] },
      // Allows you to use "<%= require('./file.svg') %>" in your HTML code to get a data URI
      { test: /\.(png|jpg|gif|webp|svg)$/, use: ['url-loader'] },
      {
        test: /\.riv$/,
        loader: 'url-loader',
        options: {
          /* data table
          8kb = 8192
          5mb = 5_242_880
          */
          // Inline files smaller than the value as base64 data URIs.
          // Adjust the limit as needed.
          limit: 5_242_880,
          // Name pattern for files larger than the limit.
          name: 'assets/riv/[name].[hash].[ext]',
        },
      },
      // {
      //   test: /\.(woff|woff2|eot|ttf|otf)$/i,
      //   type: 'src/ui/assets/fonts',
      //   generator: {
      //     filename: 'fonts/[name][ext][query]', // Organize fonts into a directory
      //   }
      // }
    ],
  },
  // Webpack tries these extensions for you if you omit the extension like "import './file'"
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  // Tells Webpack to generate "ui.html" and to inline "ui.ts" into it
  plugins: [
    new webpack.DefinePlugin({
      global: {}, // Fix missing symbol error when running in developer VM
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: './src/ui.html',
      filename: 'ui.html',
      inlineSource: '.(js|css)$',
      chunks: ['ui'],
      minify: true,
      cache: false
    }),
    new HtmlInlineScriptPlugin({
      htmlMatchPattern: [/ui.html/],
      scriptMatchPattern: [/.js$/]
    }),
    new HtmlInlineCSSWebpackPlugin(),
    // new MiniCssExtractPlugin()
    // new HtmlWebpackInlineSourcePlugin()
  ]
});
