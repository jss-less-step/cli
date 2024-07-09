import registCommand from "./registCommand.js";
import packagejson from "../package.json";
import { getNpmVersions, getDefaultRegistry } from "@jss-cli/utils-get-npm-info";
import logger from "@jss-cli/utils-log";
import { homedir } from "os";
import fs from "fs";
import { error } from "console";
import dotEnv from "dotenv";
import path from "path";

function checkDebugMode(argv) {
	if (argv.includes("-d") || argv.includes("--debug")) {
		process.env.logLevel = "debug";
		logger.level = "debug";
		logger.debug("启用调试模式");
	} else {
		logger.level = "info";
		process.env.logLevel = "info";
	}
}

function checkUserHome() {
	const userHome = homedir();
	if (!userHome || !fs.existsSync(userHome)) {
		throw new error("用户主目录不存在");
	}
	process.env.cli_userHome = userHome;
	logger.debug(`用户主目录: ${process.env.cli_userHome}`);
}

function registEnv() {
	const configPath = path.resolve(process.env.cli_userHome, ".env");
	if (fs.existsSync(configPath)) {
		const config = dotEnv.config({
			path: configPath,
		});
		logger.debug("环境变量: " + JSON.stringify(config));
	} else {
		logger.debug("环境变量不存在");
	}
}

async function checkPackageVersion() {
	const version = packagejson.version;
	const name = packagejson.name;
	const registry = getDefaultRegistry();
	const avaliableVersions = await getNpmVersions(name, registry);
	if (!avaliableVersions.includes(version)) {
		logger.warn("当前版本不在可用版本中，请更新脚手架版本");
	}
}
export default async function core(argv) {
	//检查是否是debug模式
	checkDebugMode(argv);
	//检查版本号
	await checkPackageVersion();
	//检查用户主目录
	checkUserHome();
	//注册环境变量
	registEnv();
	//注册指令
	registCommand(argv);
}
