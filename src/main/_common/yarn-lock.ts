import fs from 'fs';
import path from 'path';
import * as lockfile from '@yarnpkg/lockfile';
import { Yarn_Lock_Name } from '../../constants';
import { IYarnLockFile, IYarnLockPackage } from '../..//types';

export function getYarnLockFile(url: string): IYarnLockFile {
    url = path.resolve(url, Yarn_Lock_Name);
    const fileStr = fs.readFileSync(url, { encoding: 'utf-8' });
    const yarnLock = lockfile.parse(fileStr);

    if (yarnLock.type !== 'success') {
        return {};
    }

    return yarnLock.object;
}

export function getDependenciesFromLockFile(nameVersion: string, yarnLock: IYarnLockFile): IYarnLockPackage | null {
    const res = yarnLock[nameVersion];

    if (!res) {
        return null;
    }

    return res;
}
