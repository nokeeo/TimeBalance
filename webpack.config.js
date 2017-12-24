const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    "background_scripts.js": "./src/background/backgroundLogger.ts",
    "content_scripts.js": "./src/content_scripts/inputTracker.ts",
    "styles.css": "./node_modules/purecss/build/pure-min.css"
  },

  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: /node_modules/,
        options: {
          fix: true
        }
      },

      {
        test: /\.ts$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/
      },

      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader'
        })
      }
    ],
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]"
  },

  plugins: [
    new ExtractTextPlugin('styles.css')
  ]
}
