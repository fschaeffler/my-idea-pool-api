import log from './logging';
import { LOG_LEVELS } from '../constants/constants';
import { STATUS_CODES } from '../constants/response';
import database from '../database/database';

export default async (event, context, exec) => {
    try {
        /* eslint-disable-next-line no-param-reassign */
        context.callbackWaitsForEmptyEventLoop = false;

        await database();
        const result = await exec();

        return result;
    } catch (error) {
        log(`request failed: ${error}`, LOG_LEVELS.ERROR);

        return {
            statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR
        };
    }
};
