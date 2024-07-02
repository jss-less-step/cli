import semverPkg from "semver";
import axios from "axios";
import urlJoin from "url-join";

export function getDefaultRegistry(isOrigin) {
	return isOrigin ? "https://registry.npmjs.org" : "https://registry.npmmirror.com";
}

export async function getNpmInfo(npmName, registry) {
	const registryUrl = registry || getDefaultRegistry(false);
	const pkgUrl = urlJoin(registryUrl, npmName);
	const response = await axios.get(pkgUrl);
	if (response.status === 200) {
		return response.data;
	} else {
		return null;
	}
}

export async function getNpmVersions(npmName, registry) {
	const info = await getNpmInfo(npmName, registry);
	return Object.keys(info?.versions || []);
}

export function getSemverVersions(baseVersion, versions) {
	return versions.filter((version) => {
		return semverPkg.satisfies(version, `^${baseVersion}`);
	});
}
