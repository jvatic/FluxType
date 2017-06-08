var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');

var extractCSS = new ExtractTextPlugin({filename: '[name].[contenthash].css'});

var SRC_DIR = path.resolve(__dirname, 'src');
var TEST_DIR = path.resolve(__dirname, 'test');
var VENDOR_DIR = path.resolve(__dirname, 'vendor');
var DIST_DIR = path.resolve(__dirname, 'dist');

var pathHasParent = function (path, parentPath) {
	return path.substr(0, parentPath.length) === parentPath;
};

module.exports = {
	entry: {
		'main': ['./src/index.js', './src/index.sass'],
		'test': ['./test/index.js', './vendor/qunit.css']
	},
	output: {
		filename: '[name].[hash].js',
		path: DIST_DIR
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'FluxType',
			template: 'src/index.ejs',
			chunks: ['main'],
			inject: false
		}),
		new HtmlWebpackPlugin({
			title: 'FluxType Test',
			template: 'test/index.ejs',
			filename: 'test.html',
			chunks: ['test'],
			inject: false
		}),
		extractCSS,
		new ManifestPlugin({})
	],
	devtool: 'source-map',
	module: {
		loaders: [
			{
				loader: 'babel-loader',
				include: function (path) {
					return pathHasParent(path, SRC_DIR) || pathHasParent(path, TEST_DIR);
				},
				test: /\.js$/,
				query: {
					presets: ['es2015'],
					plugins: ['transform-runtime']
				}
			},
			{
				test: /\.(png)$/,
				include: function (path) {
					return pathHasParent(path, SRC_DIR);
				},
				loader: 'file-loader?name=[name].[ext]'
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				include: function (path) {
					return pathHasParent(path, VENDOR_DIR);
				},
				loader: 'file-loader?name=[name].[ext]'
			},
			{
				loader: extractCSS.extract({ use: [
					{ loader: 'css-loader', options: { sourceMap: true } }
				]}),
				include: function (path) {
					return pathHasParent(path, VENDOR_DIR);
				},
				test: /\.css$/
			},
			{
				loader: extractCSS.extract({ use: [
					{ loader: 'css-loader', options: { sourceMap: true } },
					{ loader: 'sass-loader', options: { sourceMap: true } }
				]}),
				include: function (path) {
					return pathHasParent(path, SRC_DIR);
				},
				test: /\.sass/
			},
		]
	}
};
