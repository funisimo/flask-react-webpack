const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const CopyPlugin = require("copy-webpack-plugin");

const manifestOptions = {
  filter (file) {
    return file.name.search('.js') !== -1
  }
}

const paths = {
  src: path.resolve(__dirname, 'src'),
  build: path.resolve(__dirname, 'build')
}

const htmlConfig = {
  template: path.join(paths.src, 'index.html'),
  inject: 'body',
  minify : {
    collapseWhitespace: true,
  }
}

const common = {
  entry: path.join(paths.src, 'index.tsx'),
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  output: {
    path: paths.build,
    filename: 'bundle.[hash].js',
    publicPath: '/react/build/',
  },
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env']
          }
        }
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'ts-loader',
        }
      },
      {
        test: /\.(css)$/,
        use: [
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  },
  plugins: [
      new CopyPlugin({
            patterns: [
                { from: "node_modules/scichart/_wasm/scichart2d.data", to: "" },
                { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
                { from: "node_modules/scichart/_wasm/scichart3d.data", to: "" },
                { from: "node_modules/scichart/_wasm/scichart3d.wasm", to: "" },
            ],
        }),
    new WebpackManifestPlugin(manifestOptions),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(htmlConfig),
  ]
};

const devSettings = {
  devtool: 'eval-source-map',
  devServer: {
    client: {
      logging: 'info',
    },
    historyApiFallback: false,
    compress: true,
    port: 9000,
    devMiddleware: {
      index: true,
      mimeTypes: { phtml: 'text/html' },
      publicPath: '/',
      serverSideRender: true,
      writeToDisk: true,
    },
  },
  plugins: [
    new WebpackManifestPlugin(manifestOptions),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
  ]
}

const prodSettings = {
  optimization: {
    minimize: true,
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({ 'process.env': {
      NODE_ENV: JSON.stringify('production')
    }}),
  ]
}

/**
* Exports
**/

const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

if (TARGET === 'start') {
  module.exports = merge(common, devSettings)
}

if (TARGET === 'start:dev') {
  module.exports = merge(common, devSettings)
}

if (TARGET === 'build' || !TARGET) {
  module.exports = merge(common, prodSettings)
}