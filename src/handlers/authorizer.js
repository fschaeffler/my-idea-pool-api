import authorize from '../controllers/authorizer';
import preparedContext from '../helpers/context';

export default (event, context) =>
    preparedContext(event, context, () => authorize(event));
