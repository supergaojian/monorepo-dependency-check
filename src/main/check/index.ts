import { IYarnLockFile } from '../../types';
import { getCommonInfo } from '../_common/get-common-info';
import { getDependenciesFromLockFile } from '../_common/yarn-lock';

type ICheckParams = string[];

interface IDependenciesMap {
    [key: string]: IDependenciesMap;
}

interface IWorkItem {
    isRoot: boolean;
    rootMap: IDependenciesMap,
    yarnLock: IYarnLockFile,
    currentMap: IDependenciesMap
    programMap: IDependenciesMap, 
    dependencies?: Record<string, string>,
}

function deepGetDependencies(params: IWorkItem, workList: IWorkItem[]) {
    const { isRoot, yarnLock, rootMap, currentMap, programMap, dependencies } = params;

    if (!dependencies) {
        return;
    }

    Object.entries(dependencies).forEach(([name, version]) => {
        const res = getDependenciesFromLockFile(`${name}@${version}`, yarnLock);
        if (!res) {
            return;
        }
        
        const { version: realVersion, dependencies: currentDependencies } = res;
        const unionKey = `${name}@${realVersion}`;
        let current = {};

        if (isRoot) {
            programMap[unionKey] = {};
            return;
        }
 
        // check have same version package or not
        if (!rootMap[unionKey]) {
            // not exist same version, check is exist different version
            const existKey = Object.keys(rootMap).find(key => key.startsWith(`${name}@`));
            
            if (!existKey) {
                // new package should in the root node_modules
                current = rootMap[unionKey] = {};
            } else {
                // exist same package but different version
                // should in programs node_modules
                // check is exist in programs
                if (!programMap[unionKey]) {
                    const existKey = Object.keys(programMap).find(key => key.startsWith(`${name}@`));

                    if (!existKey) {
                        current = programMap[unionKey] = {};
                    } else {
                        current = currentMap[unionKey] = {};
                    }
                } else {
                    // exist same key
                    return;
                }
            }
        } else {
            return;
        }

        if (currentDependencies) {
            // we should deep install package
            workList.push({
                isRoot: false,
                yarnLock,
                rootMap, 
                programMap, 
                currentMap: current,
                dependencies: currentDependencies,
            });
        }
    });
}

export default function check(cwd: string, params: ICheckParams) {
    const dependenciesMap: IDependenciesMap = {};

    const { yarnLock, programs } = getCommonInfo(cwd);

    const workList: IWorkItem[] = [];

    // map all programs package.json generate map
    programs.forEach(packageJson => {
        if (!packageJson) {
            return;
        }

        const programName = packageJson.name;
        const dependencies = packageJson.json.dependencies || {};
        const devDependencies = packageJson.json.devDependencies || {};

        Object.assign(dependencies, devDependencies);
        dependenciesMap[programName] = {};

        workList.push({
            isRoot: packageJson.isRoot,
            yarnLock,
            rootMap: dependenciesMap, 
            programMap: dependenciesMap[programName], 
            currentMap: dependenciesMap[programName],
            dependencies,
        });
    });
   
    while(workList.length) {
        const item = workList.shift();
        deepGetDependencies(item, workList);
    }

    console.log(dependenciesMap)
}
