"use strict";
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BUILD_DIR = path.resolve(__dirname, "public/build/assets");
const APP_DIR = path.resolve(__dirname, "src");
const { CleanWebpackPlugin }=require("clean-webpack-plugin");

const config = {
  context: APP_DIR,
  entry: {
    app: "./index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle-[hash].js",
    publicPath: "/",
  },
  optimization: {
    splitChunks: {
      maxSize: 10000000,
      name: true,
      chunks: "all",
    },
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`
      new CssMinimizerPlugin(),
      new TerserPlugin(),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, //Check for all js files
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          babelrc: false,
          presets: ["@babel/preset-env", "@babel/preset-react"],
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true,
          plugins: [
            "@babel/plugin-proposal-function-bind",
            "@babel/plugin-proposal-class-properties",
          ],
        },
      },
      {
        test: /\.(scss|css)$/,
        loaders: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.(ttf|woff2||eot|woff|otf?)$/,
        exclude: /node_modules/,
        use: {
          loader: "url-loader",
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css",
      chunkFilename: "[id].[hash].css",
    }),
    new HtmlWebpackPlugin({
      inject: "body",
      // filename: path.join(__dirname, "public/build/index.html"),
      template: path.join(__dirname, "public/index.html"),
    }),
  ],
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, "dist"),
    // contentBase: `${__dirname}/public/build/js`,
    port: 8080,
    publicPath: 'http://localhost:8080/',
    hot: true,
    historyApiFallback: true,
    watchContentBase: true
  },
};

module.exports = config;
