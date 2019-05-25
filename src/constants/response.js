export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    MOVED_PERMANENTLY: 301,
    MOVED_TEMPORARILY: 302,
    SEE_OTHER: 303,
    BAD_PARAMETERS: 400,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500
};

export const ERROR_CODES = {
    DATABASE_UNAVAILABLE: '[D1] database unavailable',
    UNKNOWN: '[V1]: unknown validation error',
    USER_EMAIL: '[VU1]: invalid or missing email',
    USER_EMAIL_EXISTS: '[VU4]: email already exists',
    USER_NAME: '[VU2]: invalid or missing name',
    USER_PASSWORD: '[VU3]: invalid or missing password'
};
