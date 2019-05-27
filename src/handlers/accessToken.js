import preparedContext from '../helpers/context';

import {
    loginAccessToken,
    logoutAccessToken,
    refreshAccessToken
} from '../controllers/accessToken';

export const login = (event, context) =>
    preparedContext(event, context, () => loginAccessToken(event));

export const logout = (event, context) =>
    preparedContext(event, context, () => logoutAccessToken(event));

export const refresh = (event, context) =>
    preparedContext(event, context, () => refreshAccessToken(event));
