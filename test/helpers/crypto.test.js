import assert from 'assert';
import { describe } from 'mocha';
import {
    getPasswordHash,
    isPasswordMatch,
    randomUid
} from '../../src/helpers/crypto';

describe('helpers/crypto', function() {
    const password = 'test-Passw0rd';

    it('should create unique random uids', function() {
        assert.notEqual(randomUid(), randomUid());
    });

    it('should respect the defined random uid length', function() {
        assert.equal(randomUid(13).length, 13);
    });

    it('should create deterministic password hashes', function() {
        assert.equal(getPasswordHash(password), getPasswordHash(password));
    });

    it('should respect the defined APP_SECRET when creating password hashes', function() {
        const currentAppSecret = process.env.APP_SECRET;
        const currentAppSecretPasswordHash = getPasswordHash(password);

        process.env.APP_SECRET = 'test-app-secret';
        const passwordHash = getPasswordHash(password);
        process.env.APP_SECRET = currentAppSecret;

        assert.notEqual(currentAppSecretPasswordHash, passwordHash);
    });

    it('should match password and password hash', function() {
        assert.equal(
            isPasswordMatch(password, getPasswordHash(password)),
            true
        );
    });
});
