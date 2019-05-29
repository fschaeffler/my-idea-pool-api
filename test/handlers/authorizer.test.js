import assert from 'assert';
import { describe } from 'mocha';
import authorizer from '../../src/handlers/authorizer';
import { STATUS_CODE_STRINGS } from '../../src/constants/response';
import { createJwtToken } from '../../src/helpers/jwt';

describe('handlers/authorizer', function() {
    it('should reject unauthorized access', async function() {
        await authorizer({}, {}).catch(error =>
            assert.equal(error, STATUS_CODE_STRINGS.UNAUTHORIZED)
        );
    });

    it('should reject access on invalid access token', async function() {
        await authorizer(
            { authorizationToken: 'invalid-access-token' },
            {}
        ).catch(error => assert.equal(error, STATUS_CODE_STRINGS.UNAUTHORIZED));
    });

    it('should reject access on missing user id', async function() {
        const { jwt } = createJwtToken({});

        await authorizer({ authorizationToken: jwt.toString() }, {}).catch(
            error => assert.equal(error, STATUS_CODE_STRINGS.UNAUTHORIZED)
        );
    });

    it('should gain access on valid access token', async function() {
        const userId = 123;
        const { jwt } = createJwtToken({ userId });
        const result = await authorizer(
            { authorizationToken: jwt.toString() },
            {}
        );

        assert.equal(result.principalId, userId);

        const statementResource = result.policyDocument.Statement[0].Resource;

        assert(statementResource.includes(process.env.AWS_LAMBDA_REGION));
        assert(statementResource.includes(process.env.AWS_LAMBDA_STAGE));

        const currentState = process.env.AWS_LAMBDA_STAGE;
        process.env.AWS_LAMBDA_STAGE = 'local';
        const resultLocal = await authorizer(
            { authorizationToken: jwt.toString() },
            {}
        );
        assert(
            resultLocal.policyDocument.Statement[0].Resource.includes(
                'random-account-id'
            )
        );
        process.env.AWS_LAMBDA_STAGE = currentState;
    });
});
