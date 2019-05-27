import { Idea } from '../models/idea';
import { DEFAULT_PAGINATION } from '../constants/constants';

const getAverageScore = idea =>
    (idea.impact + idea.ease + idea.confidence) / 3.0;

export const createIdea = async (userId, idea) =>
    Idea.create({
        ...idea,
        userId,
        averageScore: getAverageScore(idea)
    });

export const removeIdea = async (userId, id) =>
    Idea.destroy({
        where: { id, userId }
    });

export const listIdeas = async (
    userId,
    page,
    pagination = DEFAULT_PAGINATION
) =>
    Idea.findAll({
        where: { userId },
        attributes: { exclude: ['updatedAt', 'userId'] },
        order: [['updatedAt', 'DESC']],
        offset: page * pagination,
        limit: pagination
    });

export const updateIdea = async (userId, id, idea) => {
    const ideaExtended = {
        ...idea,
        averageScore: getAverageScore(idea)
    };

    delete ideaExtended.id;
    delete ideaExtended.createdAt;

    const updateResult = await Idea.update(ideaExtended, {
        where: { userId, id }
    });

    if (updateResult.length !== 1) {
        return null;
    }

    return Idea.findOne({
        where: { id },
        attributes: { exclude: ['updatedAt', 'userId'] }
    });
};
