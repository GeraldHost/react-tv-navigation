const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  plugins: [
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
      title: "TV Nav Example",
      template: "./public/index.html",
      inject: "body",
      env: "development",
      publicPath: "/",
    }),],
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    hot: true,
  },
  devtool: 'source-map'
};