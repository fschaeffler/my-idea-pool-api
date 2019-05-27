import Sequelize from 'sequelize';

/* eslint-disable-next-line import/no-mutable-exports */
export let Idea;

const initIdea = sequelize => {
    Idea = sequelize.define('Idea', {
        content: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        impact: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        ease: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        confidence: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        averageScore: {
            type: Sequelize.FLOAT,
            allowNull: false
        }
    });
};

export default initIdea;
