import assert from 'assert';
import { describe } from 'mocha';
import isValid from '../../src/validations/user';
import { ERROR_CODES } from '../../src/constants/response';

const validDefaultUser = {
    email: 'test@test.com',
    name: 'Test User',
    password: 'aA1XXXXX'
};

describe('validations/user', function() {
    it('should accept a valid user', function() {
        assert.equal(isValid(validDefaultUser), null);
    });

    it('should reject an user on invalid emails', function() {
        assert.equal(
            isValid({
                ...validDefaultUser,
                email: undefined
            }),
            ERROR_CODES.USER_EMAIL
        );

        assert.equal(
            isValid({
                ...validDefaultUser,
                email: null
            }),
            ERROR_CODES.USER_EMAIL
        );

        assert.equal(
            isValid({
                ...validDefaultUser,
                email: ''
            }),
            ERROR_CODES.USER_EMAIL
        );

        assert.equal(
            isValid({
                ...validDefaultUser,
                email: 'test@invalid'
            }),
            ERROR_CODES.USER_EMAIL
        );

        assert.equal(
            isValid({
                ...validDefaultUser,
                email: 'test@invalid.invalid'
            }),
            ERROR_CODES.USER_EMAIL
        );

        const userCopy = JSON.parse(JSON.stringify(validDefaultUser));
        delete userCopy.email;

        assert.equal(isValid(userCopy), ERROR_CODES.USER_EMAIL);
    });

    it('should reject an user on invalid names', function() {
        assert.equal(
            isValid({
                ...validDefaultUser,
                name: undefined
            }),
            ERROR_CODES.USER_NAME
        );

        assert.equal(
            isValid({
                ...validDefaultUser,
                name: null
            }),
            ERROR_CODES.USER_NAME
        );

        assert.equal(
            isValid({
                ...validDefaultUser,
                name: ''
            }),
            ERROR_CODES.USER_NAME
        );

        assert.equal(
            isValid({
                ...validDefaultUser,
                name: 123
            }),
            ERROR_CODES.USER_NAME
        );
    });

    it('should reject an user on invalid passwords', function() {
        assert.equal(
            isValid({
                ...validDefaultUser,
                password: undefined
            }),
            ERROR_CODES.USER_PASSWORD
        );

        assert.equal(
            isValid({
                ...validDefaultUser,
                password: null
            }),
            ERROR_CODES.USER_PASSWORD
        );

        assert.equal(
            isValid({
                ...validDefaultUser,
                password: ''
            }),
            ERROR_CODES.USER_PASSWORD
        );

        assert.equal(
            isValid({
                ...validDefaultUser,
                password: 123567890
            }),
            ERROR_CODES.USER_PASSWORD
        );

        assert.equal(
            isValid({
                ...validDefaultUser,
                password: 'aA1'
            }),
            ERROR_CODES.USER_PASSWORD
        );
    });
});
