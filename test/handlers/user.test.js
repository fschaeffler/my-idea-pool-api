import assert from 'assert';
import { describe } from 'mocha';
import sinon from 'sinon';
import gravatar from 'gravatar';
import { signup, profile } from '../../src/handlers/user';
import { STATUS_CODES, ERROR_CODES } from '../../src/constants/response';

describe('handlers/user', function() {
    const fakeAvatarUrl = 'https://www.test.com/test.png';

    before(function() {
        sinon.stub(gravatar, 'url').callsFake(() => fakeAvatarUrl);
    });

    after(function() {
        sinon.restore();
    });

    it('should return a bad parameters status on missing body', async function() {
        const response = await signup(null, {});
        assert.equal(response.statusCode, STATUS_CODES.BAD_PARAMETERS);
    });

    it('should return a bad parameters status on invalid user signup data', async function() {
        const payload = JSON.stringify({
            email: 'test@invalid',
            name: 'Test User',
            password: 'aB1xxxxx'
        });

        const response = await signup({ body: payload }, {});

        assert.equal(response.statusCode, STATUS_CODES.BAD_PARAMETERS);

        const parsedBody = JSON.parse(response.body);
        assert.equal(parsedBody.error, ERROR_CODES.USER_EMAIL);
    });

    it('should sign up new users', async function() {
        const payload = JSON.stringify({
            email: 'test@test.com',
            name: 'Test User',
            password: 'aB1xxxxx'
        });

        const response = await signup({ body: payload }, {});

        assert.equal(response.statusCode, STATUS_CODES.CREATED);

        const parsedBody = JSON.parse(response.body);
        assert(parsedBody.jwt);
        assert(parsedBody.refresh_token);
    });

    it('should fail for already existing email addresses', async function() {
        const payload = JSON.stringify({
            email: 'test@test.com',
            name: 'Test User',
            password: 'aB1xxxxx'
        });

        const response = await signup({ body: payload }, {});

        assert.equal(response.statusCode, STATUS_CODES.BAD_PARAMETERS);

        const parsedBody = JSON.parse(response.body);
        assert.equal(parsedBody.error, ERROR_CODES.USER_EMAIL_EXISTS);
    });

    it('should return the user profile for authorized users', async function() {
        const payload = JSON.stringify({
            email: 'test-profile@test.com',
            name: 'Test User',
            password: 'aB1xxxxx'
        });

        const responseSignup = await signup({ body: payload }, {});

        const { jwt } = JSON.parse(responseSignup.body);

        const responseProfile = await profile(
            {
                headers: {
                    'x-access-token': jwt
                }
            },
            {}
        );

        assert.equal(responseProfile.statusCode, STATUS_CODES.OK);
        const parsedBody = JSON.parse(responseProfile.body);

        assert.deepEqual(
            {
                email: 'test-profile@test.com',
                name: 'Test User',
                avatar_url: fakeAvatarUrl
            },
            parsedBody
        );
    });
});
