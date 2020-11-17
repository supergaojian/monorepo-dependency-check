import check from './check';

function dispatchCommand() {
    const args = process.argv.slice(2);
    const [command, ...params] = args;

    if (command === 'check' || !command) {
        check(params);
    } else if (command === 'update') {

    } else {
        // unknow command
        
    }
}

dispatchCommand();
