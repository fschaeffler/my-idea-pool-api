import jwt from 'jsonwebtoken';
import randToken from 'rand-token';
import { STATUS_CODE_STRINGS } from '../constants/response';

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
