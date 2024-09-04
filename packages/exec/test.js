import { spawn } from "child_process";
const childProcess = spawn("nvm list", { shell: true });
childProcess.stdout.on("data", (chunk) => {
	console.log(chunk.toString());
});
