if (!process.env.npm_execpath.endsWith('yarn.js')) {
    throw new Error('Please use `yarn install` instead of `npm install`');
}
