import { Command } from "commander";
import path from "path";
import fs from "fs";

export default function registCommand(argv) {
	const program = new Command();
	const jsonPath = path.join(__dirname, "../package.json");
	const packageJsonStr = fs.readFileSync(jsonPath, "utf-8");
	const packageJson = JSON.parse(packageJsonStr);
	const version = packageJson.version;
	program.name("jss-cli").description("前端构建脚手架").version(version);
	program
		.command("init")
		.description("新建项目")
		.option("-tp,--targetPath")
		.action(() => {
			console.log(argv);
		});
	program.parse();
}
