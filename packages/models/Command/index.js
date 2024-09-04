import logger from "@jss-cli/utils-log";
import semver from "semver";
const targetNodeVersion = "18.0.0";
class Command {
	constructor(argv) {
		if (!argv) {
			throw new Error("argv不能为空");
		}
		if (!Array.isArray(argv)) {
			throw new Error("Package的构建函数options应是一个数组");
		}
		if (argv.length < 2) {
			throw new Error("参数列表不能为空");
		}
		new Promise(() => {
			let chain = Promise.resolve();
			chain = chain.then(() => this.checkNodeVersion());
			chain = chain.then(() => this.initArgs(argv));
			chain = chain.then(() => this.init());
			chain.catch((error) => {
				logger.error(error);
			});
		});
	}
	init() {
		throw new Error("init必须实现");
	}
	exec() {
		throw new Error("exec必须实现");
	}
	checkNodeVersion() {
		let currentNodeVersion = process.version;
		if (semver.gt(targetNodeVersion, currentNodeVersion)) {
			throw new Error(`脚手架要求node版本大于${targetNodeVersion}`);
		}
	}
	initArgs(argv) {
		this._argv = argv[0];
		this._cmd = argv[argv.length - 1];
	}
}
export default Command;
