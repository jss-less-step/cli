import config from "../webpack.config.js";
import webpack from "webpack";
// 创建一个编译器实例
const compiler = webpack(config);

// 运行编译器并处理回调
compiler.run((err, stats) => {
	if (err) {
		console.error("Webpack 编译错误:", err);
		return;
	}

	console.log("Webpack 编译成功");
	console.log(
		stats.toString({
			colors: true, // 使用颜色输出
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false,
		})
	);
});
