import assert from 'assert';
import { describe } from 'mocha';
import isValid from '../../src/validations/idea';
import { ERROR_CODES } from '../../src/constants/response';

const validDefaultIdea = {
    content: 'a text with not more than 254 characters',
    impact: 10,
    ease: 2,
    confidence: 3
};

describe('validations/idea', function() {
    it('should accept a valid idea', function() {
        assert.equal(isValid(validDefaultIdea), null);
    });

    it('should reject an idea on invalid contents', function() {
        assert.equal(
            isValid({
                ...validDefaultIdea,
                content: undefined
            }),
            ERROR_CODES.IDEA_CONTENT
        );

        assert.equal(
            isValid({
                ...validDefaultIdea,
                content: null
            }),
            ERROR_CODES.IDEA_CONTENT
        );

        assert.equal(
            isValid({
                ...validDefaultIdea,
                content: ''
            }),
            ERROR_CODES.IDEA_CONTENT
        );

        assert.equal(
            isValid({
                ...validDefaultIdea,
                content: 123
            }),
            ERROR_CODES.IDEA_CONTENT
        );

        const ideaCopy = JSON.parse(JSON.stringify(validDefaultIdea));
        delete ideaCopy.content;

        assert.equal(isValid(ideaCopy), ERROR_CODES.IDEA_CONTENT);
    });

    it('should reject an idea on invalid impacts', function() {
        assert.equal(
            isValid({
                ...validDefaultIdea,
                impact: undefined
            }),
            ERROR_CODES.IDEA_IMPACT
        );

        assert.equal(
            isValid({
                ...validDefaultIdea,
                impact: null
            }),
            ERROR_CODES.IDEA_IMPACT
        );

        assert.equal(
            isValid({
                ...validDefaultIdea,
                impact: ''
            }),
            ERROR_CODES.IDEA_IMPACT
        );

        assert.equal(
            isValid({
                ...validDefaultIdea,
                impact: -1
            }),
            ERROR_CODES.IDEA_IMPACT
        );

        assert.equal(
            isValid({
                ...validDefaultIdea,
                impact: 0
            }),
            ERROR_CODES.IDEA_IMPACT
        );

        assert.equal(
            isValid({
                ...validDefaultIdea,
                impact: 11
            }),
            ERROR_CODES.IDEA_IMPACT
        );

        const ideaCopy = JSON.parse(JSON.stringify(validDefaultIdea));
        delete ideaCopy.impact;

        assert.equal(isValid(ideaCopy), ERROR_CODES.IDEA_IMPACT);
    });

    it('should reject an idea on invalid eases', function() {
        assert.equal(
            isValid({
                ...validDefaultIdea,
                ease: undefined
            }),
            ERROR_CODES.IDEA_EASE
        );

        assert.equal(
            isValid({
                ...validDefaultIdea,
                ease: null
            }),
            ERROR_CODES.IDEA_EASE
        );

        assert.equal(
            isValid({
                ...validDefaultIdea,
                ease: ''
            }),
            ERROR_CODES.IDEA_EASE
        );

        assert.equal(
            isValid({
                ...validDefaultIdea,
                ease: -1
            }),
            ERROR_CODES.IDEA_EASE
        );

        assert.equal(
            isValid({
                ...validDefaultIdea,
                ease: 0
            }),
            ERROR_CODES.IDEA_EASE
        );

        assert.equal(
            isValid({
                ...validDefaultIdea,
                ease: 11
            }),
            ERROR_CODES.IDEA_EASE
        );

        const ideaCopy = JSON.parse(JSON.stringify(validDefaultIdea));
        delete ideaCopy.ease;

        assert.equal(isValid(ideaCopy), ERROR_CODES.IDEA_EASE);
    });

    it('should reject an idea on invalid confidences', function() {
        assert.equal(
            isValid({
                ...validDefaultIdea,
                confidence: undefined
            }),
            ERROR_CODES.IDEA_CONFIDENCE
        );

        assert.equal(
            isValid({
                ...validDefaultIdea,
                confidence: null
            }),
            ERROR_CODES.IDEA_CONFIDENCE
        );

        assert.equal(
            isValid({
                ...validDefaultIdea,
                confidence: ''
            }),
            ERROR_CODES.IDEA_CONFIDENCE
        );

        assert.equal(
            isValid({
                ...validDefaultIdea,
                confidence: -1
            }),
            ERROR_CODES.IDEA_CONFIDENCE
        );

        assert.equal(
            isValid({
                ...validDefaultIdea,
                confidence: 0
            }),
            ERROR_CODES.IDEA_CONFIDENCE
        );

        assert.equal(
            isValid({
                ...validDefaultIdea,
                confidence: 11
            }),
            ERROR_CODES.IDEA_CONFIDENCE
        );

        const ideaCopy = JSON.parse(JSON.stringify(validDefaultIdea));
        delete ideaCopy.confidence;

        assert.equal(isValid(ideaCopy), ERROR_CODES.IDEA_CONFIDENCE);
    });
});
