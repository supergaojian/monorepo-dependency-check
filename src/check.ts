import { findPackageJson } from './utils/find-package-json';
import { logError } from './utils/loggoer';

type ICheckParams = string[];

export default function check(params: ICheckParams) {
    const cwd = process.cwd();
    const packageList = findPackageJson(cwd);

    if (packageList.length === 0) {
        logError('no validable package.json')
        process.exit(1);
    }
}
