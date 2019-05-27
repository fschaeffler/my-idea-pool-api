import jwt from 'jsonwebtoken';
import randToken from 'rand-token';
import { STATUS_CODE_STRINGS } from '../constants/response';
import { toLowerCase } from './format';

export const createJwtToken = payload => ({
    jwt: jwt.sign(payload, process.env.APP_SECRET, { expiresIn: 10 * 60 }),
    refreshToken: randToken.uid(256)
});

export const decode = token => jwt.decode(token);

export const isValid = token => {
    try {
        jwt.verify(token, process.env.APP_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return STATUS_CODE_STRINGS.EXPIRED_TOKEN;
        }

        return STATUS_CODE_STRINGS.UNAUTHORIZED;
    }

    return null;
};

export const getUserId = event => {
    if (!event || !event.headers) {
        return null;
    }

    const accessToken = toLowerCase(event.headers)['x-access-token'];

    if (!accessToken) {
        return null;
    }

    return decode(accessToken).userId;
};
