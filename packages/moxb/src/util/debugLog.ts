interface Logger {
    log(...stuff: any[]): void;
    debug(...stuff: any[]): void;
    info(...stuff: any[]): void;
    warn(...stuff: any[]): void;
    error(...stuff: any[]): void;
}

const getRealLogger = (prefix: string): Logger => ({
    log(...stuff) {
        console.log(prefix, ':', ...stuff);
    },

    debug(...stuff) {
        console.debug(prefix, ':', ...stuff);
    },

    info(...stuff) {
        console.info(prefix, ':', ...stuff);
    },

    warn(...stuff) {
        console.warn(prefix, ':', ...stuff);
    },

    error(...stuff) {
        console.error(prefix, ':', ...stuff);
    },
});

const fakeLogger: Logger = {
    log() {},
    debug() {},
    info() {},
    warn() {},
    error() {},
};

export const getDebugLogger = (prefix: string, debugMode?: boolean): Logger =>
    !!debugMode ? getRealLogger(prefix) : fakeLogger;
