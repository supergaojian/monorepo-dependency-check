import colors from 'colors';
import packJson from '../../package.json';

const prefix = colors.bgGreen(`[${packJson.name}]`);

export function log(msg: string) {
    console.log(`${prefix} ${msg}`);
}

export function logError(msg: string) {
    console.log(`${prefix} ${colors.red(msg)}`);
}

export function logWarning(msg: string) {
    console.log(`${prefix} ${colors.yellow(msg)}`);
}
