import { createLogger, transports, format } from "winston";
import colors from "colors";

//log信息
const logInfoMap = {
	info: {
		icon: "ℹ️ ", // 信息图标
		color: "blue", // 信息颜色
		severity: "low", // 严重程度
		description: "Informational messages that highlight the progress of the application at a coarse-grained level", // 描述
	},
	warn: {
		icon: "⚠️ ", // 警告图标
		color: "yellow", // 警告颜色
		severity: "medium", // 严重程度
		description: "Potentially harmful situations which still allow the application to continue running", // 描述
	},
	error: {
		icon: "❌", // 错误图标
		color: "red", // 错误颜色
		severity: "high", // 严重程度
		description: "Error events that might still allow the application to continue running", // 描述
	},
	debug: {
		icon: "🐛", // 调试图标
		color: "green", // 调试颜色
		severity: "low", // 严重程度
		description: "Fine-grained informational events that are most useful to debug an application", // 描述
	},
	verbose: {
		icon: "🔍", // 详细信息图标
		color: "cyan", // 详细信息颜色
		severity: "low", // 严重程度
		description: "Verbose information, typically for debugging or troubleshooting", // 描述
	},
};

// 自定义日志格式
const customFormat = format.printf(({ level, message }) => {
	const logInfo = logInfoMap[level];
	const levelWithColor = colors[logInfo.color](level);
	switch (Object.prototype.toString.call(message)) {
		case "[object Object]":
			message = colors[logInfo.color]("\n" + JSON.stringify(message, null, 4));
			break;
		case "[object Array]":
			message = colors[logInfo.color](JSON.stringify(message));
			break;
	}
	return `${logInfo.icon} [${levelWithColor}]: ${message}`;
});

const logLevel = process.env.logLevel || "debug";

// 创建日志记录器
const logger = createLogger({
	level: logLevel, // 日志级别
	format: customFormat,
	transports: [
		new transports.Console(), // 输出到控制台
	],
});

export default logger;
