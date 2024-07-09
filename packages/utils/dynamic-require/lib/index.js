"use strict";

module.exports = async function dynamicRequire(path) {
	return import(path);
};
