import { STATUS_CODE_STRINGS } from '../constants/response';
import { isValid, decode } from '../helpers/jwt';

// schema based on the offical AWS documentation
// https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
export const getAuthorizerResponse = userId => {
    const { AWS_ACCOUNT_ID, AWS_LAMBDA_REGION, AWS_LAMBDA_STAGE } = process.env;

    const accountId =
        AWS_LAMBDA_STAGE === 'local' ? 'random-account-id' : AWS_ACCOUNT_ID;

    return {
        principalId: userId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: 'Allow',
                    Resource: `arn:aws:execute-api:${AWS_LAMBDA_REGION}:${accountId}:*/${AWS_LAMBDA_STAGE}/*`
                }
            ]
        }
    };
};

export default async event => {
    const jwtToken = event.authorizationToken;

    if (!jwtToken) {
        return Promise.reject(STATUS_CODE_STRINGS.UNAUTHORIZED);
    }

    const validationError = isValid(jwtToken);
    if (validationError) {
        return Promise.reject(validationError);
    }

    const { userId } = decode(jwtToken);

    if (!userId) {
        return Promise.reject(STATUS_CODE_STRINGS.UNAUTHORIZED);
    }

    return getAuthorizerResponse(userId);
};
