import log from './logging';
import { LOG_LEVELS, WARMUP_EVENT_SOURCE } from '../constants/constants';
import { STATUS_CODES } from '../constants/response';
import database from '../database/database';

export default async (event, context, exec, rethrowError) => {
    try {
        /* eslint-disable-next-line no-param-reassign */
        context.callbackWaitsForEmptyEventLoop = false;

        await database();

        if (event && event.source === WARMUP_EVENT_SOURCE) {
            return WARMUP_EVENT_SOURCE;
        }

        const result = await exec();

        return result;
    } catch (error) {
        if (rethrowError) {
            return Promise.reject(error);
        }

        log(`request failed: ${error}`, LOG_LEVELS.ERROR);

        return {
            statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR
        };
    }
};
