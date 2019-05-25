import { User } from '../models/user';
import { AccessToken } from '../models/accessToken';

export const createUser = user => User.create(user);

export const findOneByEmail = email =>
    User.findOne({
        where: { email },
        attributes: ['id']
    });

export const findOneByAccessToken = jwt =>
    User.findOne({
        include: {
            model: AccessToken,
            where: { jwt }
        }
    });
