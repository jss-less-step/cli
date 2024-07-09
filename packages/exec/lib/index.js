import path from "path";
import logger from "@jss-cli/utils-log";
import dynamicRequire from "@jss-cli/utils-dynamic-require";
import { getNpmVersions } from "@jss-cli/utils-get-npm-info";
import { Package } from "@jss-cli/models";
const prefix = "@jss-cli/command";
export default async function exec() {
	let targetPath = process.env.cli_targetPath;

	if (targetPath) {
		logger.info("采用本地路径：" + targetPath);
		const pkg = new Package({ targetPath, version: "0.0.1" });
		let module;
		try {
			module = await dynamicRequire("file://" + pkg.mainFilePath); //这样可以实现动态导入esmodule同时又不会因为webpack打包而出现问题
		} catch (error) {
			logger.error(error.stack);
		}
		if (module) {
			logger.info("加载模块成功");
			if (module.default) {
				module.default();
			}
		}
	} else {
		let cmdObj = Array.from(arguments)[arguments.length - 1];
		let packageName = `${prefix}-${cmdObj.name()}`;
		let targetVersion = process.env.cli_targetVersion;
		const avaliableVersions = await getNpmVersions(packageName);
		if (!targetVersion || !avaliableVersions.includes(targetVersion)) {
			targetVersion = avaliableVersions[avaliableVersions.length - 1];
		}
		let userHome = process.env.cli_userHome;
		let storeHome = process.env.cli_storeHome;
		let storePath = path.resolve(userHome, storeHome);
		logger.info("采用缓存路径: " + storePath);
		logger.info(`指令包名：${packageName}`);
		logger.info(`指令版本：${targetVersion}`);
		const pkg = new Package({ storePath, version: targetVersion, name: packageName });
		logger.debug(pkg);
	}
}
