import { captureException, captureMessage } from '@sentry/nextjs';

/* eslint-disable no-console */
class Logger {
    static debug = console.debug.bind(console);
    static log = console.log.bind(console);
    static error = (...args: any[]) => {
        // Check if the first argument is an instance of Error
        if (args[0] instanceof Error) {
            // If it's an Error, capture it as an exception in Sentry
            captureException(args[0]);
        } else {
            // If it's not an Error, log it as a message in Sentry
            captureMessage(args.toString(), 'error');
        }

        console.error(...args);
    };
}

export const { log, debug, error } = Logger;
