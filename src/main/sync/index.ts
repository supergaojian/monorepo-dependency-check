import fs from 'fs';
import path from 'path';
import semver from 'semver';
import { IPackageJson } from '../../types';
import { PackageJson_Name } from '../../constants/index';
import { getCommonInfo } from '../_common/get-common-info';

function replace(params: {
    programs:{
        name: string;
        url: string;
        json: IPackageJson;
    }[];
    dependencies: Record<string, string>;
    packageJsonStr: string;
}) {
    let { programs, dependencies, packageJsonStr } = params;

    Object.entries(dependencies).forEach(([key, version]) => {
        const exist = programs.find(p => p.name === key);

        if (!exist) {
            return;
        }

        const res = semver.intersects(version, exist.json.version);

        if (!res) {
            // old version need update
            const reg = new RegExp(`("${key}":)(\\s*)("${version}")`);

            packageJsonStr = packageJsonStr.replace(reg, (_, p1, p2) => {
                return `${p1}${p2}"${exist.json.version}"`;
            });
        }
    });

    return packageJsonStr;
}

export default function sync(cwd: string) {
    const { programs } = getCommonInfo(cwd);

    programs.forEach(program => {
        const { json, url } = program;
        const { dependencies = {}, devDependencies = {}, peerDependencies = {} } = json;
        const packageJsonUrl = path.resolve(url, PackageJson_Name);

        let packageJsonStr = fs.readFileSync(packageJsonUrl, { encoding: 'utf-8' });
        packageJsonStr = replace({ programs, dependencies, packageJsonStr });
        packageJsonStr = replace({ programs, dependencies: devDependencies, packageJsonStr });
        packageJsonStr = replace({ programs, dependencies: peerDependencies, packageJsonStr });

        fs.writeFileSync(packageJsonUrl, packageJsonStr, { encoding: 'utf-8' });
    });
}
