import { Command } from "commander";
import path from "path";
import fs from "fs";
import logger from "@jss-cli/utils-log";
import exec from "@jss-cli/exec";
export default function registCommand(argv) {
	const program = new Command();
	const jsonPath = path.join(__dirname, "../package.json");
	const packageJsonStr = fs.readFileSync(jsonPath, "utf-8");
	const packageJson = JSON.parse(packageJsonStr);
	const version = packageJson.version;
	program.name("jss-cli").description("前端构建脚手架").version(version).usage("<command> [options]");
	program.command("init").description("新建项目").action(exec);
	program.option("-d --debug", "启用调试模式", false);
	program.option("-tp,--targetPath <指令目录>", "指令目录");
	program.option("-tv,--targetVersion <指令版本>", "指令版本");
	program.on("command:*", function (obj) {
		const avaliableCommands = program.commands.map((cmd) => cmd.name());
		const currentCommand = obj[0];
		if (!avaliableCommands.includes(currentCommand)) {
			logger.error(`${currentCommand}指令不存在`);
			logger.error(`可用指令有:${JSON.stringify(avaliableCommands)}`);
		}
	});
	program.on("option:targetPath", function () {
		process.env.cli_targetPath = program.opts().targetPath;
	});
	program.on("option:targetVersion", function () {
		process.env.cli_targetVersion = program.opts().targetVersion;
	});
	program.parse(argv);
}
