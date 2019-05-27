import * as _ from 'underscore';
import isValid from '../validations/idea';
import { toResponse } from '../helpers/format';
import { STATUS_CODES } from '../constants/response';
import { getUserId } from '../helpers/jwt';

import {
    createIdea as createIdeaRepo,
    removeIdea as removeIdeaRepo,
    listIdeas as listIdeasRepo,
    updateIdea as updateIdeaRepo
} from '../repositories/idea';

const transformIdeaFormat = idea => ({
    ..._.pick(idea, [
        'id',
        'content',
        'impact',
        'ease',
        'confidence',
        'averageScore'
    ]),
    createdAt: idea.createdAt.getTime()
});

export const createIdea = async event => {
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

    const userId = getUserId(event);

    if (!userId) {
        return {
            statusCode: STATUS_CODES.UNAUTHORIZED
        };
    }

    const idea = await createIdeaRepo(userId, data);

    if (!idea || !idea.id) {
        return {
            statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR
        };
    }

    return {
        statusCode: STATUS_CODES.CREATED,
        body: toResponse(transformIdeaFormat(idea))
    };
};

export const removeIdea = async event => {
    const ideaId = event.pathParameters.id;
    const userId = getUserId(event);

    if (!userId) {
        return {
            statusCode: STATUS_CODES.UNAUTHORIZED
        };
    }

    const result = await removeIdeaRepo(userId, ideaId);

    if (!result) {
        return {
            statusCode: STATUS_CODES.BAD_PARAMETERS
        };
    }

    return {
        statusCode: STATUS_CODES.NO_CONTENT
    };
};

export const listIdeas = async event => {
    const userId = getUserId(event);

    const page = Math.max(
        1,
        (event.queryStringParameters && event.queryStringParameters.page) || 1
    );

    if (!userId) {
        return {
            statusCode: STATUS_CODES.UNAUTHORIZED
        };
    }

    const ideas = await listIdeasRepo(userId, page);

    return {
        statusCode: STATUS_CODES.OK,
        body: toResponse(_.map(ideas || [], idea => transformIdeaFormat(idea)))
    };
};

export const updateIdea = async event => {
    if (!event || !event.body) {
        return {
            statusCode: STATUS_CODES.BAD_PARAMETERS
        };
    }

    const ideaId = event.pathParameters.id;

    const data = JSON.parse(event.body);
    const validationError = isValid(data);

    if (validationError) {
        return {
            statusCode: STATUS_CODES.BAD_PARAMETERS,
            body: toResponse({ error: validationError })
        };
    }

    const userId = getUserId(event);

    if (!userId) {
        return {
            statusCode: STATUS_CODES.UNAUTHORIZED
        };
    }

    const updatedIdea = await updateIdeaRepo(userId, ideaId, data);

    if (!updatedIdea) {
        return {
            statusCode: STATUS_CODES.BAD_PARAMETERS
        };
    }

    return {
        statusCode: STATUS_CODES.CREATED,
        body: toResponse(transformIdeaFormat(updatedIdea))
    };
};
