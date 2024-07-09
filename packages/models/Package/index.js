import { packageDirectorySync } from "pkg-dir";
import path, { normalize, resolve } from "path";
import fs from "fs";
import fsExtra from "fs-extra";
import npminstall from "npminstall";
class Package {
	version; //版本
	packagePath; //包路径
	storePath; //缓存路径
	dependencePath; //缓存依赖根路径
	mainFilePath; //主文件路径
	isPackageExist;
	isCached;
	packageJson;
	constructor(options) {
		if (!options) {
			throw new Error("Package构建函数options参数不能为空");
		}
		if (Object.prototype.toString.call(options) !== "[object Object]") {
			throw new Error("Package的构建函数options应是一个对象");
		}
		if (options.targetPath) {
			//根据targetPath查询
			const packageInfo = this.getPackageJson(options.targetPath);
			if (packageInfo) {
				this.version = this.packageJson.version;
				this.name = this.packageJson.name;
				this.packagePath = packageInfo.packagePath;
				this.packageJson = packageInfo.packageJson;
				this.mainFilePath = packageInfo.mainFilePath;
			} else {
				throw new Error("targetPath本地依赖路径未找到Package");
			}
			this.isCached = false;
		} else if (options.storePath && options.version && options.name) {
			//根据版本，包名，本地缓存路径来构建package
			this.storePath = options.storePath;
			this.name = options.name;
			this.version = options.version;
			this.isCached = true;
			this.dependencePath = path.resolve(this.storePath, "dependence");
			fsExtra.ensureDirSync(this.dependencePath);
			const cachedPackagePath = this.getCachedPackagePath(this.dependencePath, this.name, this.version);
			if (!fs.existsSync(cachedPackagePath)) {
				this.isPackageExist = false;
			} else {
				this.isPackageExist = true;
			}
			this.packagePath = cachedPackagePath;
		} else {
			throw new Error("options参数中至少要有{storePath,version,name}或者targetPath");
		}
	}

	getCachedPackagePath(root, name, version) {
		return path.normalize(`${root}/node_modules/.store/${name.replaceAll("/", "+")}@${version}/node_modules/${name}`);
	}

	async install(root, name, version) {
		console.log("install");
		await npminstall({
			root,
			pkgs: [{ name, version }],
		});
		const { packageJson, packagePath } = this.getPackageJson(this.packagePath);
		this.packagePath = packagePath;
		this.version = packageJson.version;
		this.name = packageJson.name;
		this.mainFilePath = path.resolve(this.packagePath, packageJson.main || packageJson.module);
	}

	update() {
		console.log("update");
	}

	getPackageJson(p) {
		let packagePath = packageDirectorySync({ cwd: normalize(p) });
		if (packagePath && fs.existsSync(packagePath)) {
			const jsonBuffer = fs.readFileSync(resolve(packagePath, "package.json"), "utf-8");
			let packageJson = JSON.parse(jsonBuffer);
			return {
				packageJson,
				packagePath,
				mainFilePath: path.normalize(`${packagePath}/${packageJson.main || packageJson.module}`),
			};
		}
	}
}
export default Package;
