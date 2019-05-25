import Sequelize from 'sequelize';

/* eslint-disable-next-line import/no-mutable-exports */
export let User;

const initUser = sequelize => {
    User = sequelize.define('User', {
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            index: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        passwordHash: {
            type: Sequelize.STRING,
            allowNull: false
        },
        avatarUrl: Sequelize.STRING
    });
};

export default initUser;
