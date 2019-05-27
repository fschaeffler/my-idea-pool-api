import jwt from 'jsonwebtoken';
import { STATUS_CODE_STRINGS } from '../constants/response';
import { toLowerCase } from './format';
import { randomUid } from './crypto';

export const createJwtToken = payload => ({
    jwt: jwt.sign(payload, process.env.APP_SECRET, { expiresIn: 10 * 60 }),
    refreshToken: randomUid(256)
});

export const isInvalid = token => {
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

export const decode = token => jwt.decode(token);

export const getUserId = event => {
    if (!event || !event.headers) {
        return null;
    }

    const accessToken = toLowerCase(event.headers)['x-access-token'];

    if (!accessToken) {
        return null;
    }

    const payload = !isInvalid(accessToken) && decode(accessToken);
    return (payload && payload.userId) || null;
};
