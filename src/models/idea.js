import Sequelize from 'sequelize';

/* eslint-disable-next-line import/no-mutable-exports */
export let Idea;

const initIdea = sequelize => {
    Idea = sequelize.define('Idea', {
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        impact: {
            type: Sequelize.NUMBER,
            allowNull: false
        },
        ease: {
            type: Sequelize.NUMBER,
            allowNull: false
        },
        confidence: {
            type: Sequelize.NUMBER,
            allowNull: false
        },
        averageScore: {
            type: Sequelize.DECIMAL,
            allowNull: false
        }
    });
};

export default initIdea;
