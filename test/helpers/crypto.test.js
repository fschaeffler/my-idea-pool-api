import assert from 'assert';
import { describe } from 'mocha';
import {
    getPasswordHash,
    isPasswordMatch,
    randomUid
} from '../../src/helpers/crypto';

describe('helpers/crypto', function() {
    const password = 'test-Passw0rd';

    describe('randomUid', function() {
        it('should create unique uids', function() {
            assert.notEqual(randomUid(), randomUid());
        });

        it('should respect the defined length', function() {
            assert.equal(randomUid(13).length, 13);
        });
    });

    describe('getPasswordHash', function() {
        it('should create deterministic password hashes', function() {
            assert.equal(getPasswordHash(password), getPasswordHash(password));
        });

        it('should respect the defined APP_SECRET', function() {
            const currentAppSecret = process.env.APP_SECRET;
            const currentAppSecretPasswordHash = getPasswordHash(password);

            process.env.APP_SECRET = 'test-app-secret';
            const passwordHash = getPasswordHash(password);
            process.env.APP_SECRET = currentAppSecret;

            assert.notEqual(currentAppSecretPasswordHash, passwordHash);
        });
    });

    describe('isPasswordMatch', function() {
        it('should match password and password hash', function() {
            assert.equal(
                isPasswordMatch(password, getPasswordHash(password)),
                true
            );
        });
    });
});
