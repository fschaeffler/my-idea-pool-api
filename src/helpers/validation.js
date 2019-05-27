import joi from '@hapi/joi';
import * as _ from 'underscore';
import { ERROR_CODES } from '../constants/response';

export default (input, schema, errorMap = []) => {
    const validation = joi.validate(input, schema);
    const errors = [];

    if (validation.error && validation.error.details) {
        _.forEach(validation.error.details, details => {
            const fieldName = details.message.split('"')[1];
            const fieldError = errorMap[fieldName] || ERROR_CODES.UNKNOWN;
            errors.push(fieldError);
        });
    }

    return errors.length ? _.unique(errors).join('; ') : null;
};
