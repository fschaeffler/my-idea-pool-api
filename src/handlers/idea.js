import preparedContext from '../helpers/context';

import {
    createIdea,
    removeIdea,
    listIdeas,
    updateIdea
} from '../controllers/idea';

export const create = (event, context) =>
    preparedContext(event, context, () => createIdea(event));

export const remove = (event, context) =>
    preparedContext(event, context, () => removeIdea(event));

export const list = (event, context) =>
    preparedContext(event, context, () => listIdeas(event));

export const update = (event, context) =>
    preparedContext(event, context, () => updateIdea(event));
