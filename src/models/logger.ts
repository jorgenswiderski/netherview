/* eslint-disable no-console */
class Logger {
    static debug = console.debug.bind(console);
    static log = console.log.bind(console);
    static error = console.error.bind(console);
}

export const { log, debug, error } = Logger;
