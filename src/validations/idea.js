import joi from '@hapi/joi';
import { ERROR_CODES } from '../constants/response';
import validate from '../helpers/validation';

const ERROR_MAP = {
    content: ERROR_CODES.IDEA_CONTENT,
    impact: ERROR_CODES.IDEA_IMPACT,
    ease: ERROR_CODES.IDEA_EASE,
    confidence: ERROR_CODES.IDEA_CONFIDENCE
};

const schema = joi.object().keys({
    content: joi
        .string()
        .min(1)
        .max(255)
        .required(),
    impact: joi
        .number()
        .min(1)
        .max(10)
        .required(),
    ease: joi
        .number()
        .min(1)
        .max(10)
        .required(),
    confidence: joi
        .number()
        .min(1)
        .max(10)
        .required()
});

export default input => validate(input, schema, ERROR_MAP);
