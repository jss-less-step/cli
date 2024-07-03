import { Command } from "commander";
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
