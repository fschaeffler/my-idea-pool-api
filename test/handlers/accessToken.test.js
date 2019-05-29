import assert from 'assert';
import { describe } from 'mocha';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { login, logout, refresh } from '../../src/handlers/accessToken';
import { signup } from '../../src/handlers/user';
import { STATUS_CODES } from '../../src/constants/response';
import { createJwtToken } from '../../src/helpers/jwt';
import { AccessToken } from '../../src/models/accessToken';
import { User } from '../../src/models/user';

describe('handlers/accessToken', function() {
    it('should reject invalid login credentials', async function() {
        const response1 = await login(null, {});
        assert.equal(response1.statusCode, STATUS_CODES.UNAUTHORIZED);

        const response2 = await login(
            {
                email: 'access-token@test.com',
                password: 'aB1xxxxx'
            },
            {}
        );

        assert.equal(response2.statusCode, STATUS_CODES.UNAUTHORIZED);
    });

    it('should reject the login on failed access token creation', async function() {
        const user = {
            email: 'access-token-invalid-jwt@test.com',
            name: 'Test User',
            password: 'aB1xxxxx'
        };

        await signup({ body: JSON.stringify(user) }, {});

        sinon.stub(jwt, 'sign');

        const response = await login(
            {
                body: JSON.stringify({
                    email: user.email,
                    password: user.password
                })
            },
            {}
        );

        sinon.restore();

        assert.equal(response.statusCode, STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('should reject the login on failed user retrieval', async function() {
        const user = {
            email: 'access-token-invalid-jwt@test.com',
            name: 'Test User',
            password: 'aB1xxxxx'
        };

        await signup({ body: JSON.stringify(user) }, {});

        sinon.stub(User, 'findOne').callsFake(() => ({
            email: user.email,
            name: user.name,
            passwordHash: 'fake-password-hash',
            avatarUrl: 'http://www.test.com/fake-avatar.png'
        }));

        const response = await login(
            {
                body: JSON.stringify({
                    email: user.email,
                    password: user.password
                })
            },
            {}
        );

        sinon.restore();

        assert.equal(response.statusCode, STATUS_CODES.UNAUTHORIZED);
    });

    it('should return an access token on successful login', async function() {
        const user = {
            email: 'access-token2@test.com',
            name: 'Test User',
            password: 'aB1xxxxx'
        };

        await signup({ body: JSON.stringify(user) }, {});

        const response = await login(
            {
                body: JSON.stringify({
                    email: user.email,
                    password: user.password
                })
            },
            {}
        );

        assert.equal(response.statusCode, STATUS_CODES.CREATED);

        const parsedBody = JSON.parse(response.body);
        assert(parsedBody.jwt);
        assert(parsedBody.refresh_token);
    });

    it('should not allow a logout for invalid refresh tokens', async function() {
        const response = await logout(
            { body: JSON.stringify({ refresh_token: 'abc-fake-token' }) },
            {}
        );
        assert.equal(response.statusCode, STATUS_CODES.BAD_PARAMETERS);
    });

    it('should give a proper response on a successful logout', async function() {
        await AccessToken.create({ refreshToken: 'abc.def.ghi' });
        const response = await logout(
            { body: JSON.stringify({ refresh_token: 'abc.def.ghi' }) },
            {}
        );
        assert.equal(response.statusCode, STATUS_CODES.NO_CONTENT);
    });

    it('should not allow a refresh for invalid refresh tokens', async function() {
        const response = await refresh(
            { body: JSON.stringify({ refresh_token: 'abc-fake-token' }) },
            {}
        );
        assert.equal(response.statusCode, STATUS_CODES.BAD_PARAMETERS);
    });

    it('should give a proper response on a successful token refresh', async function() {
        const user = await User.create({
            email: 'refresh-token@test.com',
            name: 'Test User',
            passwordHash: 'fake-hash',
            avatarUrl: 'http://www.test.com/fake-avatar.png'
        });

        await AccessToken.create({
            refreshToken: 'jkl.mno.pqr',
            userId: user.id
        });
        const response = await refresh(
            { body: JSON.stringify({ refresh_token: 'jkl.mno.pqr' }) },
            {}
        );

        assert.equal(response.statusCode, STATUS_CODES.OK);
    });
});
