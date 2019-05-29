import assert from 'assert';
import { describe } from 'mocha';
import database, { reset } from '../../src/database/database';

describe('database/database', function() {
    it('should connect to the production database when no sqlite file defined', async function() {
        const connection = await database();
        assert(connection);

        reset();

        const connectionAfterReset = await database();

        assert.notEqual(connection, connectionAfterReset);
    });
});
