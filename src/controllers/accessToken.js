import * as _ from 'underscore';
import { findOneByEmailAndPasswordHash } from '../repositories/user';
import { STATUS_CODES } from '../constants/response';
import { getPasswordHash } from '../helpers/crypto';
import { toResponse } from '../helpers/format';

import {
    createAccessToken,
    deleteByRefreshToken,
    updateByRefreshToken
} from '../repositories/accessToken';

export const loginAccessToken = async event => {
    const data = JSON.parse(event.body);

    const passwordHash = getPasswordHash(data.password);
    delete data.password;

    const user = await findOneByEmailAndPasswordHash(data.email, passwordHash);

    if (!user || !user.id) {
        return {
            statusCode: STATUS_CODES.UNAUTHORIZED
        };
    }

    const accessToken = await createAccessToken(user.id);

    if (!accessToken || !accessToken.jwt || !accessToken.refreshToken) {
        return {
            statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR
        };
    }

    return {
        statusCode: STATUS_CODES.CREATED,
        body: toResponse(_.pick(accessToken, ['jwt', 'refreshToken']))
    };
};

export const logoutAccessToken = async event => {
    const data = JSON.parse(event.body);
    const result = await deleteByRefreshToken(data.refresh_token);

    if (!result) {
        return {
            statusCode: STATUS_CODES.BAD_PARAMETERS
        };
    }

    return {
        statusCode: STATUS_CODES.NO_CONTENT
    };
};

export const refreshAccessToken = async event => {
    const data = JSON.parse(event.body);
    const jwt = await updateByRefreshToken(data.refresh_token);

    if (!jwt) {
        return {
            statusCode: STATUS_CODES.BAD_PARAMETERS
        };
    }

    return {
        statusCode: STATUS_CODES.OK,
        body: toResponse({ jwt })
    };
};
