const path = require('path');

const result = require('dotenv').config({
    path: path.resolve(process.cwd(), `test/.env/env.test`)
});

if (result.error) {
    throw result.error;
}
