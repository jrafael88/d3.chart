const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { DefinePlugin } = require('webpack');

module.exports = (env) => ({
  mode: "development",
  entry: {
    app: path.join(__dirname, "src", "index.js"),
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    headers: { "Access-Control-Allow-Origin": "*" },
    compress: true,
    port: 3000,
    historyApiFallback: true,
    disableHostCheck: true,
  },
  target: "web",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      views: path.resolve(__dirname, "src/views"),
      components: path.resolve(__dirname, "src/components"),
      routes: path.resolve(__dirname, "src/routes"),
      store: path.resolve(__dirname, "src/store"),
      hooks: path.resolve(__dirname, "src/hooks"),
      assets: path.resolve(__dirname, "src/assets"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              encoding: false,
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
    new CopyPlugin({
      patterns: [{ from: "src/assets/", to: "assets/" }],
    }),
    new DefinePlugin({
      "process.env.APP_ENV": env && JSON.stringify(env.APP_ENV),
    }),
  ],
});