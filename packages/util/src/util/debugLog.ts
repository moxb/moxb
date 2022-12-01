export interface Logger {
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
    log() {
        // This is intentionally empty
    },
    debug() {
        // This is intentionally empty
    },
    info() {
        // This is intentionally empty
    },
    warn() {
        // This is intentionally empty
    },
    error() {
        // This is intentionally empty
    },
};

export const getDebugLogger = (prefix: string, debugMode?: boolean): Logger =>
    debugMode ? getRealLogger(prefix) : fakeLogger;

export interface FineGrainedLogConfiguration {
    logLog?: boolean;
    logDebug?: boolean;
    logInfo?: boolean;
    logWarn?: boolean;
    logError?: boolean;
}

export const getFineGrainedDebugLogger = (
    prefix: string,
    config: FineGrainedLogConfiguration,
    debugMode?: boolean
): Logger => {
    if (!debugMode) {
        return fakeLogger;
    }

    const realLogger = getRealLogger(prefix);
    return {
        log: config.logLog ? realLogger.log : fakeLogger.log,
        debug: config.logDebug ? realLogger.debug : fakeLogger.debug,
        info: config.logInfo ? realLogger.info : fakeLogger.info,
        warn: config.logWarn ? realLogger.warn : fakeLogger.warn,
        error: config.logError ? realLogger.error : fakeLogger.error,
    };
};
