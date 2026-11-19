const path = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (_env, argv) => {
  const isProduction = argv.mode === "production";
  const styleLoader = isProduction
    ? MiniCssExtractPlugin.loader
    : "style-loader";

  return {
    entry: path.resolve(__dirname, "src/index.tsx"),
    target: ["web", "es2020"],
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "assets/js/[name].[contenthash:8].js",
      chunkFilename: "assets/js/[name].[contenthash:8].chunk.js",
      assetModuleFilename: "assets/media/[name].[contenthash:8][ext]",
      publicPath: isProduction ? "/reactTest/" : "/",
      clean: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: path.resolve(__dirname, "tsconfig.json"),
              },
            },
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            styleLoader,
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                modules: {
                  auto: /\.module\.[\w]+$/i,
                  localIdentName: isProduction
                    ? "[hash:base64:6]"
                    : "[path][name]__[local]",
                },
              },
            },
            "sass-loader",
          ],
        },
        {
          test: /\.css$/i,
          use: [
            styleLoader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  auto: /\.module\.css$/i,
                  localIdentName: isProduction
                    ? "[hash:base64:6]"
                    : "[path][name]__[local]",
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/images/[name].[contenthash:8][ext]",
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[name].[contenthash:8][ext]",
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public/index.html"),
        filename: "index.html",
      }),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: "assets/css/[name].[contenthash:8].css",
              chunkFilename: "assets/css/[name].[contenthash:8].chunk.css",
            }),
          ]
        : []),
    ],
    devtool: isProduction ? "source-map" : "eval-cheap-module-source-map",
    devServer: {
      port: 3000,
      hot: true,
      open: false,
      historyApiFallback: true,
      client: {
        overlay: true,
      },
    },
    optimization: {
      splitChunks: {
        chunks: "all",
      },
      runtimeChunk: "single",
    },
  };
};
