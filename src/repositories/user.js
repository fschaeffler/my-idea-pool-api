import { User } from '../models/user';

export const createUser = user => User.create(user);

export const findOneByEmail = email =>
    User.findOne({
        where: { email },
        attributes: ['id']
    });

export const findOneById = userId =>
    User.findOne({
        where: { id: userId }
    });

export const findOneByEmailAndPasswordHash = (email, passwordHash) =>
    User.findOne({
        where: { email, passwordHash },
        attributes: ['id']
    });
