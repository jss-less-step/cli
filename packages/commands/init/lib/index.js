import { Command } from "@jss-cli/models";
import logger from "@jss-cli/utils-log";
import fs from "fs";
import fse from "fs-extra";
import inquirer from "inquirer";
class InitCommand extends Command {
	init() {
		this.projectName = this._argv.projectName;
		this.force = this._argv.force;
	}
	toString() {
		return JSON.stringify({
			projectName: this.projectName,
			force: this.force,
		});
	}
	async prepare() {
		//判断当前文件夹是否为空
		let localPath = process.cwd();
		let isEmpty = this.isCwdEmpty(localPath);
		console.log(localPath);
		if (!isEmpty) {
			const { ifContinue } = await inquirer.prompt([
				{
					type: "confirm",
					name: "ifContinue",
					message: "当前文件夹不为空，是否继续创建项目？",
					default: false,
				},
			]);
			if (ifContinue) {
				//启动强制更新
				fse.emptyDirSync(localPath);
			}
		}
	}

	isCwdEmpty(p) {
		let fileList = fs.readdirSync(p); //获取执行路径文件夹下的文件列表
		fileList = fileList.filter((fileName) => {
			return !fileName.startsWith(".") && !["node_modules"].includes(fileName);
		});
		return !!fileList && fileList.length === 0;
	}

	async exec() {
		try {
			//准备阶段
			await this.prepare();
		} catch (e) {
			logger.error(e);
		}
	}
}

function init(...argv) {
	return new InitCommand(argv);
}

export default init;
