import gravatar from 'gravatar';
import log from '../helpers/logging';
import { LOG_LEVELS } from '../constants/constants';

export default email => {
    try {
        return gravatar.url(email);
    } catch (error) {
        log(
            `profile picture retrieval failed for email ${email}`,
            LOG_LEVELS.WARN
        );

        return null;
    }
};
