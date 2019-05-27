import { LOG_LEVELS } from '../constants/constants';

export default (message, logLevel = LOG_LEVELS.INFO) => {
    /* eslint-disable no-console */

    if (logLevel === LOG_LEVELS.INFO) {
        if (process.env.DEBUG === true || process.env.DEBUG === 'true') {
            console.log(`[INFO]: ${message}`);
        }

        return;
    }

    if (logLevel === LOG_LEVELS.WARN) {
        console.warn(`[WARN]: ${message}`);
        return;
    }

    if (logLevel === LOG_LEVELS.ERROR) {
        console.error(`[ERROR]: ${message}`);
    }

    /* eslint-enable no-console */
};
