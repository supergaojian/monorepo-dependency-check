import fs from 'fs';
import path from 'path';
import { IPackageJson } from '../types';
import { packageJsonName } from '../constants';

export function readPackageJson(url: string): IPackageJson | null {
    const str = fs.readFileSync(url, 'utf-8');
    
    try {
        const json = JSON.parse(str);
        return json;
    } catch (err) {
        return null;
    }
}

let count = 0;

export function findPackageJson(url: string): { url: string; json: IPackageJson; }[] {
    const packageJsonList: { url: string; json: IPackageJson; }[] = [];
    let currentUrl= url;

    while (path.dirname(currentUrl) !== currentUrl) {
        count++;
        if (count === 100) {
            break;
        }

        const packageJsonUrl = path.resolve(currentUrl, packageJsonName)
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
