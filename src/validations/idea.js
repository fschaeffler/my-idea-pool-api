import joi from '@hapi/joi';

const schema = joi.object().keys({
    content: joi
        .string()
        .min(1)
        .required(),
    impact: joi
        .number()
        .min(0)
        .max(10)
        .required(),
    ease: joi
        .number()
        .min(0)
        .max(10)
        .required(),
    confidence: joi
        .number()
        .min(0)
        .max(10)
        .required()
});

export default input => {
    const validation = joi.validate(input, schema);

    return {
        isValid: !!validation.error,
        error: validation.error
    };
};
