#!/usr/bin/env node

import sync from './main/sync/index';
import check from './main/check/index';

function dispatchCommand() {
    const cwd = process.cwd();
    const args = process.argv.slice(2);
    const [command, ...params] = args;

    if (command === 'check' || !command) {
        check(cwd, params);
    } else if (command === 'update') {

    } else if (command === 'sync') {
        sync(cwd)
    } else {
        // unknow command
        
    }
}

dispatchCommand();
