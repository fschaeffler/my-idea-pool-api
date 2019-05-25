import initAccessToken from './accessToken';
import initIdea from './idea';
import initUser from './user';

export default sequelizeInstance => {
    initAccessToken(sequelizeInstance);
    initUser(sequelizeInstance);
    initIdea(sequelizeInstance);
};
