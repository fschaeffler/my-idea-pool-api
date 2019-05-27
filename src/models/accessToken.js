import Sequelize from 'sequelize';

/* eslint-disable-next-line import/no-mutable-exports */
export let AccessToken;

const initAccessToken = sequelize => {
    AccessToken = sequelize.define('AccessToken', {
        refreshToken: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            index: true
        }
    });
};

export default initAccessToken;
