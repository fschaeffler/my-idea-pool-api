import { signupUser, getProfile } from '../controllers/user';
import preparedContext from '../helpers/context';

export const signup = (event, context) =>
    preparedContext(event, context, () => signupUser(event));

export const profile = (event, context) =>
    preparedContext(event, context, () => getProfile(event));
