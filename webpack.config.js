const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    "background_scripts.js": "./src/background/backgroundLogger.ts",
    "content_scripts.js": "./src/content_scripts/inputTracker.ts",
    "infoController.js": "./src/pages/infoController.ts",
    "popup.js": "./src/popup/popupController.ts",
    "styles.css": [
      "./node_modules/purecss/build/pure-min.css",
      "./src/popup/styles.css",
      "./src/pages/styles.scss"
    ]
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
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader']
        }),
        exclude: /node_modules/
      },

      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader']
        })
      },

      {
        test: /\.handlebars$/,
        use: 'handlebars-loader',
        exclude: /node_modules/
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
