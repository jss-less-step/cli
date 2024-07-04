import importLocal from "import-local";
import logger from "@jss-cli/utils-log";
import core from "../lib/index.js";
console.log(__filename);
if (importLocal(__filename)) {
	logger.info("使用本地加载路径");
} else {
	logger.info("使用全局版本");
	core(process.argv);
}
