import fs from 'fs';
import path from 'path';
import { IPackageJson } from '../types';
import { PackageJson_Name, Yarn_Workspace } from '../constants/index';

interface IPackageObj {
    url: string; 
    json: IPackageJson;
}

export function readPackageJson(url: string): IPackageJson | null {
    const str = fs.readFileSync(url, 'utf-8');
    
    try {
        const json = JSON.parse(str);
        return json;
    } catch (err) {
        return null;
    }
}

export function findPackageJson(url: string): IPackageObj[] {
    const packageJsonList: { url: string; json: IPackageJson; }[] = [];
    let currentUrl= url;

    while (path.dirname(currentUrl) !== currentUrl) {
        const packageJsonUrl = path.resolve(currentUrl, PackageJson_Name)
        if (fs.existsSync(packageJsonUrl)) {
            const json = readPackageJson(packageJsonUrl);
            if (json) {
                packageJsonList.push({ url: packageJsonUrl, json });
            }
        }
        currentUrl = path.dirname(currentUrl);
    }

    return packageJsonList;
}

export function findWorkspacePackageJson(packageList: IPackageObj[]): IPackageObj | null {
    const packageObj = packageList.find(p => !!p.json[Yarn_Workspace]);
    return packageObj || null;
}