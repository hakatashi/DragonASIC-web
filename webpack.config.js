module.exports = {
	entry: './index.jsx',
	output: {
		path: __dirname,
		filename: 'index.js',
	},
	devtool: 'cheap-module-eval-source-map',
	module: {
		loaders: [{
			test: /\.jsx$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			query: {
				presets: [
					['env', {
						targets: [
							'last 2 Chrome versions',
						],
					}],
					'react',
				],
				plugins: ['transform-class-properties'],
			},
		}, {
			test: /\.pcss$/,
			loaders: [
				'style-loader?sourceMap',
				'css-loader?modules&importLoaders=1',
				'postcss-loader?sourceMap',
			],
		}],
	},
};
