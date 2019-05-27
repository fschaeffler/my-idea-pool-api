import joi from '@hapi/joi';
import complexity from 'complexity';
import { ERROR_CODES } from '../constants/response';
import validate from '../helpers/validation';

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

export default input => validate(input, schema, ERROR_MAP);
