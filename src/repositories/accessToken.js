import moment from 'moment';
import jsonWebToken from 'jsonwebtoken';
import { AccessToken } from '../models/accessToken';

export const findOneByAccessToken = async jwt =>
    AccessToken.findOne({
        where: {
            jwt
            // createdAt: {
            //     $gt: moment().subtract(10, 'minutes').toDate()
            // }
        },
        attributes: ['userId']
    });

export const removeExpired = async () =>
    AccessToken.destroy({
        where: {
            createdAt: {
                $lte: moment()
                    .subtract(10, 'minutes')
                    .toDate()
            }
        }
    });

export const createAccessToken = async userId => {
    const jwt = jsonWebToken.sign({ userId }, process.env.APP_SECRET, {
        expiresIn: 10 * 60
    });
    const refreshToken = `TODO: implement refreshToken (${userId} / ${new Date()})`;

    await AccessToken.create({ jwt, refreshToken, userId });

    return { jwt, refreshToken };
};
