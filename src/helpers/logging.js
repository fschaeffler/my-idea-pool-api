import { LOG_LEVELS } from '../constants/constants';

export default (message, logLevel = LOG_LEVELS.INFO) => {
    /* eslint-disable no-console */

    if (logLevel === LOG_LEVELS.INFO) {
        console.log(`[INFO]: ${message}`);
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
