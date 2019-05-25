import joi from '@hapi/joi';
import complexity from 'complexity';
import * as _ from 'underscore';
import { ERROR_CODES } from '../constants/response';

const ERROR_MAP = {
    email: ERROR_CODES.USER_EMAIL,
    name: ERROR_CODES.USER_NAME,
    password: ERROR_CODES.USER_PASSWORD
};

const schema = joi.object().keys({
    email: joi
        .string()
        .email()
        .required(),
    name: joi
        .string()
        .min(1)
        .required(),
    password: joi
        .string()
        .regex(
            new RegExp(
                complexity.create({
                    min: 8,
                    uppercase: 1,
                    lowercase: 1,
                    digit: 1
                })
            )
        )
        .required()
});

export default input => {
    const validation = joi.validate(input, schema);
    const errors = [];

    if (validation.error && validation.error.details) {
        _.forEach(validation.error.details, details => {
            const fieldName = details.message.split('"')[1];
            const fieldError = ERROR_MAP[fieldName] || ERROR_CODES.UNKNOWN;
            errors.push(fieldError);
        });
    }

    return errors.length ? _.unique(errors).join('; ') : null;
};
