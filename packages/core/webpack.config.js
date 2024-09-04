import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import webpack from "webpack";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
	mode: "development", // 或 'development'，视你的需求而定
	entry: path.resolve(__dirname, "lib/index.js"), // 你的入口文件
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "index.cjs",
		libraryTarget: "commonjs2", // 将输出的包配置为 CommonJS2 模块
	},
	target: "node", // 目标环境是 Node.js
	module: {
		rules: [
			{
				test: /\.js$/, // 匹配所有 .js 文件
				exclude: /node_modules/, // 排除 node_modules 目录
				use: {
					loader: "babel-loader", // 使用 Babel 加载器
					options: {
						presets: ["@babel/preset-env"], // 使用 @babel/preset-env 预设
					},
				},
			},
		],
	},
	resolve: {
		extensions: [".js", ".json", "cjs", "mjs"], // 自动解析确定的扩展
	},
	plugins: [
		new webpack.BannerPlugin({
			banner: "#!/usr/bin/env node",
			raw: true, // 如果是一个纯字符串，可以将此选项设置为 true
		}),
		new webpack.CleanPlugin(),
	],
	externals: [
		{
			"import-local": "commonjs import-local",
			"@jss-cli/utils-dynamic-require": "commonjs @jss-cli/utils-dynamic-require",
			npminstall: "commonjs npminstall",
		},
	],
	devtool: "source-map",
};
