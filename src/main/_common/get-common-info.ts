import fg from 'fast-glob';
import fs from 'fs';
import path from 'path';
import { IPackageJson } from '../../types';
import { PackageJson_Name, Yarn_Workspace } from '../../constants';
import { logError, logWarning, findPackageJson, findWorkspacePackageJson } from '../../utils';
import { getYarnLockFile } from './yarn-lock';

export function getCommonInfo(cwd: string) {
    // find all packages
    const packageList = findPackageJson(cwd);

    if (packageList.length === 0) {
        logError('No valid package.json')
        process.exit(1);
    }

    // find workspace root url
    const packageObj = findWorkspacePackageJson(packageList);
    if (!packageObj) {
        logError(`No valid package.json with ${Yarn_Workspace}`);
        process.exit(1);
    }

    // get all workspace program
    const packages = packageObj.json[Yarn_Workspace];
    const workspaceRootUrl = packageObj.url.replace(`/${PackageJson_Name}`, '');
    if (!packages || packages.packages.length === 0) {
        logError(`No valid package.json with ${Yarn_Workspace}`);
        process.exit(1);
    }

    const programUrls = fg.sync(packages.packages, { onlyDirectories: true });
    
    // get all programs package.json
    let allProgramsPackageJson = programUrls.map(url => {
        const realUrl = path.resolve(cwd, url);
        try {
            const str = fs.readFileSync(path.resolve(realUrl, PackageJson_Name), 'utf-8');
            const json: IPackageJson = JSON.parse(str);
            return {
                name: json.name,
                url: realUrl,
                json,
                isRoot: false,
            }
        } catch (err) {
            logWarning(`Invalid package.json at ${realUrl}`);
            return null;
        }
    });
    allProgramsPackageJson = allProgramsPackageJson.filter(_ => _);
    allProgramsPackageJson.unshift({
        name: packageObj.json.name,
        url: packageObj.url,
        json: packageObj.json,
        isRoot: true,
    });
    
    // get yarn.lock
    const yarnLock = getYarnLockFile(workspaceRootUrl);

    return {
        programs: allProgramsPackageJson,
        yarnLock,
    }
}