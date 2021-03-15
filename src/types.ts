import { Yarn_Workspace, Yarn_Workspace_Nohist, Yarn_Workspace_Packages } from './constants/index'

export interface IWorkspace {
    [Yarn_Workspace_Packages]: string[];
    [Yarn_Workspace_Nohist]?: string[];
}
export interface IPackageJson {
    name: string;
    version: string;
    [Yarn_Workspace]?: IWorkspace;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
}

export interface IYarnLockPackage {
    version: string;
    resolved: string;
    integrity: string;
    dependencies?: Record<string, string> | null;
}

export interface IYarnLockFile {
    [key: string]: IYarnLockPackage;
}
