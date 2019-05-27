import assert from 'assert';
import { describe } from 'mocha';
import joi from '@hapi/joi';
import isValid from '../../src/helpers/validation';
import { ERROR_CODES } from '../../src/constants/response';

describe('helpers/validation', function() {
    const schema = joi.object().keys({
        field1: joi.string(),
        field2: joi.number(),
        field3: joi.boolean()
    });

    const validInput = {
        field1: 'test field value',
        field2: 123,
        field3: true
    };

    const invalidInput1 = { ...validInput, field1: 123 };
    const invalidInput2 = { ...validInput, field2: 'test field value' };
    const invalidInput3 = { ...validInput, field3: 0.56 };

    const errorMap = {
        field1: 'error1',
        field2: 'error2'
    };

    it('should return no error on valid input', function() {
        assert.equal(isValid(validInput, schema, errorMap), null);
    });

    it('should return the correct error code', function() {
        assert.equal(isValid(invalidInput1, schema, errorMap), 'error1');
        assert.equal(isValid(invalidInput2, schema, errorMap), 'error2');
    });

    it('should return an unkown error code as default', function() {
        assert.equal(
            isValid(invalidInput3, schema, errorMap),
            ERROR_CODES.UNKNOWN
        );
        assert.equal(isValid(invalidInput3, schema), ERROR_CODES.UNKNOWN);
    });
});
