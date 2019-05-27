import randToken from 'rand-token';

const crypto = require('crypto');

const hash = input =>
    crypto
        .createHash('sha256')
        .update(input)
        .digest('base64');

export const getPasswordHash = password =>
    hash(`${password}${process.env.APP_SECRET}`);

export const isPasswordMatch = (password, passwordHash) =>
    hash(`${password}${process.env.APP_SECRET}`) === passwordHash;

export const randomUid = (length = 256) => randToken.uid(length).toLowerCase();
