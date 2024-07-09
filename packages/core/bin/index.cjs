#!/usr/bin/env node
(async function () {
	const { default: importLocal } = await import("import-local");
	const { default: logger } = await import("@jss-cli/utils-log");
	const { default: core } = require("../dist/index.cjs");
	const isImportedFromLocal = importLocal(__filename);
	if (isImportedFromLocal) {
		logger.info("使用本地加载路径");
	} else {
		core(process.argv);
	}
})();
