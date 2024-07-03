import importLocal from "import-local";
import logger from "@jss-cli/utils-log";
import core from "../lib/index.js";
if (importLocal(__filename)) {
	logger.info("使用本地加载路径");
} else {
	core(process.argv);
}
