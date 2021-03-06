import assert from 'assert';
import sinon from 'sinon';
import { describe } from 'mocha';
import { AccessToken } from '../../src/models/accessToken';
import { create, remove, list, update } from '../../src/handlers/idea';
import { createJwtToken } from '../../src/helpers/jwt';
import { Idea } from '../../src/models/idea';
import { signup } from '../../src/handlers/user';
import { STATUS_CODES, ERROR_CODES } from '../../src/constants/response';
import { User } from '../../src/models/user';

describe('handlers/idea', function() {
    const validIdeaData = {
        content: 'some content',
        impact: 1,
        ease: 2,
        confidence: 3
    };

    const validUserData = {
        email: 'test-idea-create@test.com',
        name: 'Test User',
        password: 'aB1xxxxx'
    };

    it('should not create ideas with invalid data', async function() {
        const responseEmptyBody = await create(null, {});
        assert.equal(responseEmptyBody.statusCode, STATUS_CODES.BAD_PARAMETERS);

        const responseInvalidData = await create(
            {
                body: JSON.stringify({
                    content: 'some test content',
                    impact: 11
                })
            },
            {}
        );

        assert.equal(
            responseInvalidData.statusCode,
            STATUS_CODES.BAD_PARAMETERS
        );

        const parsedBodyInvalidData = JSON.parse(responseInvalidData.body);
        assert.equal(parsedBodyInvalidData.error, ERROR_CODES.IDEA_IMPACT);
    });

    it('should not create ideas for unauthorized users', async function() {
        const response = await create(
            { body: JSON.stringify(validIdeaData) },
            {}
        );
        assert.equal(response.statusCode, STATUS_CODES.UNAUTHORIZED);
    });

    it('should create ideas with valid data', async function() {
        const signupResponse = await signup(
            { body: JSON.stringify(validUserData) },
            {}
        );
        const { jwt } = JSON.parse(signupResponse.body);

        const response = await create(
            {
                body: JSON.stringify(validIdeaData),
                headers: {
                    'x-access-token': jwt
                }
            },
            {}
        );

        assert.equal(response.statusCode, STATUS_CODES.CREATED);

        const parsedBody = JSON.parse(response.body);

        assert(parsedBody.id);
        assert.equal(parsedBody.content, validIdeaData.content);
        assert.equal(parsedBody.impact, validIdeaData.impact);
        assert.equal(parsedBody.ease, validIdeaData.ease);
        assert.equal(parsedBody.confidence, validIdeaData.confidence);
    });

    it('should not allow deleting ideas for unauthorized users', async function() {
        const response = await remove({ pathParameters: { id: 1 } }, {});
        assert.equal(response.statusCode, STATUS_CODES.UNAUTHORIZED);
    });

    it('should not allow listing ideas for unauthorized users', async function() {
        const response = await list({}, {});
        assert.equal(response.statusCode, STATUS_CODES.UNAUTHORIZED);
    });

    it('should not allow updating ideas for unauthorized users', async function() {
        const response = await update(
            {
                body: JSON.stringify(validIdeaData),
                pathParameters: { id: 1 }
            },
            {}
        );

        assert.equal(response.statusCode, STATUS_CODES.UNAUTHORIZED);
    });

    it('should not update ideas with invalid data', async function() {
        const responseEmptyBody = await update(null, {});
        assert.equal(responseEmptyBody.statusCode, STATUS_CODES.BAD_PARAMETERS);

        const responseInvalidData = await update(
            {
                pathParameters: { id: 1 },
                body: JSON.stringify({
                    content: 'some test content',
                    impact: 11
                })
            },
            {}
        );

        assert.equal(
            responseInvalidData.statusCode,
            STATUS_CODES.BAD_PARAMETERS
        );

        const parsedBodyInvalidData = JSON.parse(responseInvalidData.body);
        assert.equal(parsedBodyInvalidData.error, ERROR_CODES.IDEA_IMPACT);
    });

    it('should give a proper response on a failed update', async function() {
        const responseEmptyBody = await update(null, {});
        assert.equal(responseEmptyBody.statusCode, STATUS_CODES.BAD_PARAMETERS);

        const user = await User.create({
            email: 'idea-update@test.com',
            name: 'Test User',
            passwordHash: 'fake-password-hash',
            avatarUrl: 'https://www.test.com/test.png'
        });

        const idea = await Idea.create({
            ...validIdeaData,
            userId: user.id,
            averageScore: 7.5
        });

        const { jwt } = createJwtToken({ userId: user.id });

        sinon.stub(Idea, 'update');

        const responseValidData = await update(
            {
                headers: {
                    'x-access-token': jwt
                },
                pathParameters: { id: 1 },
                body: JSON.stringify({ validIdeaData })
            },
            {}
        );

        sinon.restore();

        assert.equal(responseValidData.statusCode, STATUS_CODES.BAD_PARAMETERS);
    });

    it('should give a proper response on a successful update', async function() {
        const responseEmptyBody = await update(null, {});
        assert.equal(responseEmptyBody.statusCode, STATUS_CODES.BAD_PARAMETERS);

        const user = await User.create({
            email: 'idea-update-success@test.com',
            name: 'Test User',
            passwordHash: 'fake-password-hash',
            avatarUrl: 'https://www.test.com/test.png'
        });

        const { jwt } = createJwtToken({ userId: user.id });

        const idea = await Idea.create({
            ...validIdeaData,
            userId: user.id,
            averageScore: 7.5
        });

        const responseValidData = await update(
            {
                headers: {
                    'x-access-token': jwt
                },
                pathParameters: { id: idea.id },
                body: JSON.stringify({
                    ...validIdeaData,
                    ease: 10
                })
            },
            {}
        );

        assert.equal(responseValidData.statusCode, STATUS_CODES.CREATED);
    });
});
