import { createJwtToken } from '../helpers/jwt';
import { AccessToken } from '../models/accessToken';

export const createAccessToken = async userId => {
    const { jwt, refreshToken } = createJwtToken({ userId });
    await AccessToken.create({ refreshToken, userId });

    return { jwt, refreshToken };
};

export const deleteByRefreshToken = async refreshToken =>
    AccessToken.destroy({
        where: { refreshToken }
    });

export const updateByRefreshToken = async refreshToken => {
    const accessToken = await AccessToken.findOne({
        where: { refreshToken },
        attributes: ['userId']
    });

    if (!accessToken || !accessToken.userId) {
        return null;
    }

    const { jwt } = createJwtToken({ userId: accessToken.userId });

    return jwt;
};
