import assert from 'assert';
import { describe } from 'mocha';
import gravatar from 'gravatar';
import sinon from 'sinon';
import gravatarService from '../../src/services/gravatar';

describe('services/gravatar', function() {
    it('should not fail on a request', function() {
        assert(gravatarService('test@test.com'));
    });

    it('should not throw an exception when offline', function() {
        sinon.stub(gravatar, 'url').callsFake(() => {
            throw new Error();
        });
        sinon.stub(console, 'warn');
        assert.equal(gravatarService('fail@test.com'), null);
        sinon.restore();
    });
});
