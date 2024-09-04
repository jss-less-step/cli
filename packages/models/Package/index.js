import { packageDirectorySync } from "pkg-dir";
import path from "path";
import fs from "fs";
import fsExtra from "fs-extra";
import npminstall from "npminstall";
import { getDefaultRegistry, getLatestNpmVerion } from "@jss-cli/utils-get-npm-info";
import logger from "@jss-cli/utils-log";

const Dependence = "dependence";
/* 
	从设计上来说包的路径有两种方式获取，一种是通过targetPath直接获取到包路径，还有一种方式是通过名称，版本，缓存根路径生成包路径
	所以原则上来说判断Pacakge是否为缓存就判断Package是否有targetPath就可以了。
		
*/
class Package {
	/* 采用缓存路径 */
	targetVersion; //目标版本
	targetName; //目标库
	storePath; //缓存路径

	/* 采用目标路径 */
	targetPath; //本地路径

	/* 
		初始化函数只做参数注册，其他操作不做处理，也就是说Pacakge的创建并不保证实际的本地环境中有该Package
		因为实际使用时本地的文件内容变化是不可控的，所以在运行时再做校验是比较好的方式。
	 */
	constructor(options) {
		if (!options) {
			throw new Error("Package构建函数options参数不能为空");
		}
		if (Object.prototype.toString.call(options) !== "[object Object]") {
			throw new Error("Package的构建函数options应是一个对象");
		}
		if (options.targetPath) {
			this.targetPath = options.targetPath;
		} else if (options.storePath && options.version && options.name) {
			this.storePath = options.storePath;
			this.targetName = options.name;
			this.targetVersion = options.version;
		} else {
			throw new Error("options参数中至少要有{storePath,version,name}或者targetPath");
		}
	}

	//Package是否是使用缓存
	get isCached() {
		return !this.targetPath;
	}

	//获取本地缓存的Package路径
	get cachedPackagePath() {
		return path.normalize(
			`${this.dependencePath}/node_modules/.store/${this.targetName.replaceAll("/", "+")}@${this.targetVersion}/node_modules/${
				this.targetName
			}`
		);
	}

	//获取Package本地绝对路径
	get packagePath() {
		if (this.isCached) {
			return this.cachedPackagePath;
		} else {
			return packageDirectorySync({ cwd: this.targetPath });
		}
	}

	//Package是否存在
	get isPackageExist() {
		return fs.existsSync(this.packagePath);
	}

	//获取package的主文件路径
	get mainFilePath() {
		let packageJson = this.packageJson;
		return path.normalize(path.resolve(this.packagePath, packageJson.main || packageJson.module));
	}

	//根据packagePath获取相关信息
	get packageJson() {
		if (this.isPackageExist) {
			const jsonBuffer = fs.readFileSync(path.resolve(this.packagePath, "package.json"), "utf-8");
			let packageJson = JSON.parse(jsonBuffer);
			return packageJson;
		} else {
			throw new Error("Package不存在");
		}
	}

	//缓存依赖路径
	get dependencePath() {
		if (this.isCached) {
			let p = path.resolve(this.storePath, Dependence);
			fsExtra.ensureDirSync(p); //保证缓存路径存在
			return p;
		}
	}

	//安装操作只针对本地缓存
	async install() {
		if (this.isCached) {
			console.log("启动安装...");
			await npminstall({
				root: this.dependencePath,
				pkgs: [{ name: this.targetName, version: this.targetVersion }],
				storeDir: this.dependencePath + "node_modules",
				registry: getDefaultRegistry(false),
			});
		} else {
			logger.info("采用缓存路径才可执行安装");
		}
	}

	async update() {
		if (this.isCached) {
			let latestVersion = await getLatestNpmVerion(this.targetName);
			if (latestVersion !== this.targetVersion || !this.isPackageExist) {
				console.log("启动更新...");
				await this.install();
				this.targetVersion = latestVersion;
			} else {
				logger.info("本地Package缓存已经是最新版本: " + this.targetVersion);
			}
		}
	}
	toString() {
		return JSON.stringify(
			{
				isCached: this.isCached,
				isPackageExist: this.isPackageExist,
				packagePath: this.packagePath,
				targetPath: this.targetPath,
				targetName: this.targetName,
				targetVersion: this.targetVersion,
				storePath: this.storePath,
			},
			null,
			4
		);
	}
}

export default Package;
