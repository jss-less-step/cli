import path from "path";
import logger from "@jss-cli/utils-log";
import { getNpmVersions } from "@jss-cli/utils-get-npm-info";
import { Package } from "@jss-cli/models";
import { spawn } from "child_process";
const prefix = "@jss-cli/command";
export default async function exec() {
	debugger;
	let cmdObj = Array.from(arguments)[arguments.length - 1];
	let argv = arguments[0];
	let targetPath = process.env.cli_targetPath;
	let pkg;
	if (targetPath) {
		logger.info("采用本地路径：" + targetPath);
		pkg = new Package({ targetPath });
	} else {
		let userHome = process.env.cli_userHome;
		let storeHome = process.env.cli_storeHome;
		let storePath = path.resolve(userHome, storeHome);
		logger.info("采用缓存路径: " + storePath);
		let packageName = `${prefix}-${cmdObj.name()}`;
		let targetVersion = process.env.cli_targetVersion;
		const avaliableVersions = await getNpmVersions(packageName);
		if (!targetVersion || !avaliableVersions.includes(targetVersion)) {
			targetVersion = avaliableVersions[avaliableVersions.length - 1];
		}
		logger.info(`指令包名：${packageName}`);
		logger.info(`指令版本：${targetVersion}`);
		pkg = new Package({ storePath, version: targetVersion, name: packageName });
		await pkg.update();
	}
	logger.debug(pkg.toString());
	let formatCmd = Object.create(null);
	Object.keys(cmdObj).forEach((key) => {
		if (!key.startsWith("_") && cmdObj.hasOwnProperty(key) && key !== "parent") {
			formatCmd[key] = cmdObj[key];
		}
	});
	let formatArgument = [argv, formatCmd];
	try {
		let code = `
			(async ()=>{
				let {default:logger} =  await import("@jss-cli/utils-log");
				try{
					let importUrl = "file://" + "${pkg.mainFilePath.replace(/\\/g, "\\\\")}";
					let {default:c} = await import(importUrl);
					let command = c.apply(null,${JSON.stringify(formatArgument)});	
					await command.exec();
				}catch(e){
					 logger.error(e)
				}
			})()
		`;
		const child = spawn("node", ["-e", code], {
			cwd: process.cwd(),
			stdio: "inherit",
		});
		child.on("error", (e) => logger.error(e.message));
		child.on("exit", () => logger.info(`${cmdObj.name()}指令执行成功`));
	} catch (error) {
		logger.error(error);
	}
}
