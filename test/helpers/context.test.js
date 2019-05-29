import assert from 'assert';
import { describe } from 'mocha';
import sinon from 'sinon';
import Sequelize from 'sequelize';
import preparedContext from '../../src/helpers/context';
import { WARMUP_EVENT_SOURCE } from '../../src/constants/constants';
import { STATUS_CODES } from '../../src/constants/response';

describe('helpers/context', function() {
    const logs = {
        log: null,
        warn: null,
        error: null
    };

    const stub = () => {
        sinon.stub(console, 'log').callsFake(message => {
            logs.log = message;
        });

        sinon.stub(console, 'warn').callsFake(message => {
            logs.warn = message;
        });

        sinon.stub(console, 'error').callsFake(message => {
            logs.error = message;
        });

        sinon.stub(Sequelize.prototype, 'sync');
    };

    const unstub = () => {
        sinon.restore();
    };

    it('should return an internal server error on unexpected exceptions', async function() {
        stub();

        const result = await preparedContext();
        assert.deepEqual(result, {
            statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR
        });

        unstub();
    });

    it('should re-throw errors used for the authorization', async function() {
        stub();

        await preparedContext(null, null, null, true).catch(error => {
            unstub();
            return assert(error);
        });
    });

    it('should quickly return when executed as a warmup call', async function() {
        const result = await preparedContext(
            { source: WARMUP_EVENT_SOURCE },
            {}
        );
        assert.equal(result, WARMUP_EVENT_SOURCE);
    });

    it('should return the result of the exec function', async function() {
        stub();

        let testVariable = null;

        await preparedContext({}, { source: 'not-warmup-source' }, () => {
            testVariable = 'test';
        });
        assert.equal(testVariable, 'test');

        unstub();
    });
});
