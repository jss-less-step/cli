import config from "../webpack.config.js";
import webpack from "webpack";
// 创建一个编译器实例
const compiler = webpack(config);

compiler.watch(
	{
		// Watch options:
		aggregateTimeout: 300, // 在监听到文件变化后，延迟300ms再执行构建
		poll: undefined, // 通过轮询方式检查文件变动，默认为undefined，不开启
	},
	(err, stats) => {
		if (err) {
			console.error(err);
			return;
		}

		console.log(
			stats.toString({
				colors: true, // 使控制台输出带有颜色
				modules: false, // 不显示构建模块信息
				children: false, // 不显示子级信息
				chunks: false, // 不显示chunk信息
				chunkModules: false, // 不显示chunk模块信息
			})
		);
	}
);
