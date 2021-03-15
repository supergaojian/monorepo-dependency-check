import childProcess from 'child_process';

export function getInfoFromRemote(name: string, version?: string) {
    if (!version || ['^', '~'].includes(version[0])) {
        // get latest version
        const infoStr = childProcess.execSync(`yarn info ${name} --json`, { timeout: 5000, encoding: 'utf-8' });

    }

    const infoStr = childProcess.execSync(`yarn info ${name}@${version} --json`, { timeout: 5000, encoding: 'utf-8' });
    try {
        const info = JSON.parse(infoStr);
        return info.dependencies;
    } catch (err) {
        return null;
    }
}
