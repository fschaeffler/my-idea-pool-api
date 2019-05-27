import assert from 'assert';
import { describe } from 'mocha';
import sinon from 'sinon';
import log from '../../src/helpers/logging';
import { LOG_LEVELS } from '../../src/constants/constants';

describe('helpers/logging', function() {
    const currentDebugState = process.env.DEBUG;

    const logs = {
        log: null,
        warn: null,
        error: null
    };

    const logMessage1 = 'test-log-1';
    const logMessage2 = 'test-log-2';

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

        process.env.DEBUG = true;
    };

    const unstub = () => {
        sinon.restore();
        process.env.DEBUG = currentDebugState;
    };

    it('should write to info-log', function() {
        stub();

        log(logMessage1);
        assert.equal(logs.log, `[INFO]: ${logMessage1}`);

        log(logMessage2, LOG_LEVELS.INFO);
        assert.equal(logs.log, `[INFO]: ${logMessage2}`);

        logs.log = null;
        process.env.DEBUG = false;
        log(logMessage2, LOG_LEVELS.INFO);
        assert.equal(logs.log, null);
        process.env.DEBUG = true;

        unstub();
    });

    it('should write to warning-log', function() {
        stub();

        log(logMessage1, LOG_LEVELS.WARN);
        assert.equal(logs.warn, `[WARN]: ${logMessage1}`);

        unstub();
    });

    it('should write to error-log', function() {
        stub();

        log(logMessage1, LOG_LEVELS.ERROR);
        assert.equal(logs.error, `[ERROR]: ${logMessage1}`);

        unstub();
    });

    it('should write no log on unexpected log-levels', function() {
        stub();

        logs.log = null;
        logs.warn = null;
        logs.error = null;

        log(logMessage1, 'invalid-log-level');

        assert.equal(logs.log, null);
        assert.equal(logs.warn, null);
        assert.equal(logs.error, null);

        unstub();
    });
});
