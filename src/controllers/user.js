import * as _ from 'underscore';
import gravatar from '../services/gravatar';
import isValid from '../validations/user';
import { createAccessToken } from '../repositories/accessToken';
import {
    createUser,
    findOneByAccessToken,
    findOneByEmail
} from '../repositories/user';
import { getPasswordHash } from '../helpers/crypto';
import { STATUS_CODES, ERROR_CODES } from '../constants/response';
import { toResponse } from '../helpers/format';

export const signupUser = async event => {
    if (!event || !event.body) {
        return {
            statusCode: STATUS_CODES.BAD_PARAMETERS
        };
    }

    const data = JSON.parse(event.body);
    const validationError = isValid(data);

    if (validationError) {
        return {
            statusCode: STATUS_CODES.BAD_PARAMETERS,
            body: toResponse({ error: validationError })
        };
    }

    const existingEmail = await findOneByEmail(data.email);
    if (existingEmail) {
        return {
            statusCode: STATUS_CODES.BAD_PARAMETERS,
            body: toResponse({ error: ERROR_CODES.USER_EMAIL_EXISTS })
        };
    }

    const avatarUrl = gravatar(data.email);
    const passwordHash = getPasswordHash(data.password);

    delete data.password;

    const user = await createUser({
        ...data,
        avatarUrl,
        passwordHash
    });

    const accessToken = await createAccessToken(user.id);

    return {
        statusCode: STATUS_CODES.CREATED,
        body: toResponse(_.pick(accessToken, ['jwt', 'refreshToken']))
    };
};

export const getProfile = async event => {
    const accessToken = event.headers['x-access-token'];
    const user = await findOneByAccessToken(accessToken);

    return {
        statusCode: STATUS_CODES.OK,
        body: toResponse(_.pick(user, ['email', 'name', 'avatarUrl']))
    };
};
