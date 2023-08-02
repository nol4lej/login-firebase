const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');   

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        styles: './src/style.css'
    },
    module: {
        rules: [
          {
            test: /\.html$/i,
            loader: "html-loader",
          },
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
          {
            type: "asset",
            test: /\.(png|jpe?g|gif)$/i,
          }
        ],
    },
    plugins: [new HtmlWebpackPlugin({
        template: './index.html',
    })],

}