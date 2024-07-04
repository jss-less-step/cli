#!/usr/bin/env node
(async function () {
	const { default: importLocal } = await import("import-local");
	const { default: logger } = await import("@jss-cli/utils-log");
	const { default: core } = require("../dist/index.cjs");
	const isImportedFromLocal = importLocal(__filename);
	console.log("__filename", __filename);
	console.log("本地导入?:", isImportedFromLocal);
	if (isImportedFromLocal) {
		logger.info("使用本地加载路径");
	} else {
		core(process.argv);
	}
})();
