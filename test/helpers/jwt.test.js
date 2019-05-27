import assert from 'assert';
import { describe } from 'mocha';
import jwt from 'jsonwebtoken';
import {
    createJwtToken,
    decode,
    isInvalid,
    getUserId
} from '../../src/helpers/jwt';
import { STATUS_CODE_STRINGS } from '../../src/constants/response';

describe('helpers/jwt', function() {
    const userId = 'abc123ABC';
    const env = Object.assign({}, process.env);

    before(function() {
        process.env.APP_SECRET = 'test-app-secret';
    });

    after(function() {
        process.env = env;
    });

    it('should not fail on missing user id from the header', function() {
        assert.equal(getUserId(), null);
        assert.equal(getUserId({}), null);
        assert.equal(getUserId({ headers: {} }), null);
        assert.equal(
            getUserId({ headers: { 'not-the-token-header': 'test' } }),
            null
        );
        assert.equal(getUserId({ headers: { 'x-access-token': null } }), null);
        assert.equal(
            getUserId({ headers: { 'x-access-token': 'invalid-token' } }),
            null
        );
    });

    it('should retrieve a valid user id from the header', function() {
        const token = createJwtToken({ userId });

        const eventLowerCase = {
            headers: {
                'x-access-token': token.jwt
            }
        };

        const eventUpperCase = {
            headers: {
                'X-Access-Token': token.jwt
            }
        };

        assert.equal(getUserId(eventLowerCase), userId);

        assert.equal(getUserId(eventUpperCase), userId);
    });

    it('should decode valid token', function() {
        const token = createJwtToken({ userId });
        const decodedUserId = decode(token.jwt).userId;
        assert.equal(userId, decodedUserId);
    });

    it('should correctly validate tokens', function() {
        const token = createJwtToken({ userId });
        const validation = isInvalid(token.jwt.toString());
        assert.equal(validation, null);
    });

    it('should fail on tokens from different app secret', function() {
        const token = createJwtToken({ userId });
        process.env.APP_SECRET = 'new-app-secret';
        const validation = isInvalid(token.jwt.toString());
        assert.equal(validation, STATUS_CODE_STRINGS.UNAUTHORIZED);
    });

    it('should fail on expired tokens', function() {
        const token = jwt.sign(
            { userId, iat: Math.floor(Date.now() / 1000) - 15 * 60 },
            process.env.APP_SECRET,
            { expiresIn: 10 * 60 }
        );

        const validation = isInvalid(token);
        assert.equal(validation, STATUS_CODE_STRINGS.EXPIRED_TOKEN);
    });
});
