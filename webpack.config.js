const path = require('path');
const webpack = require('webpack');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',
  devtool: argv.mode === 'production' ? false : 'inline-source-map',
  entry: {
    ui: './src/main.ts', // Your main Vue entry point
    app: './src/app.ts' // Your plugin's main TypeScript entry point
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: { appendTsSuffixTo: [/\.vue$/] }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm-bundler.js'
    }
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.DefinePlugin({
      global: {}, // Fix missing symbol error when running in developer VM
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: './src/ui.html',
      filename: 'ui.html',
      chunks: ['ui'], // Ensure this includes only the 'ui' chunk
    }),
    new HtmlInlineScriptPlugin({
      htmlMatchPattern: [/ui.html/],
      scriptMatchPattern: [/.js$/],
    }),
    new VueLoaderPlugin()
  ]
});
