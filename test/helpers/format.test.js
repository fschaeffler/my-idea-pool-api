import assert from 'assert';
import { describe } from 'mocha';
import { toSnakeCase, toLowerCase, toResponse } from '../../src/helpers/format';

describe('helpers/format', function() {
    const snakeCase = {
        test: 'Test Value',
        test_field: 123
    };

    const lowerCase = {
        test: 'Test Value',
        test_field: 123,
        testfield: 456
    };

    const upperCase = {
        test: 'Test Value',
        test_field: 123,
        testField: 456
    };

    const camelCase = {
        test: 'Test Value',
        testField: 123
    };

    it('should return a snake case json object', function() {
        assert.deepEqual(snakeCase, toSnakeCase(camelCase));
    });

    it('should return a lower case json object', function() {
        assert.deepEqual(lowerCase, toLowerCase(upperCase));
    });

    it('should return a response object', function() {
        assert.deepEqual(JSON.stringify(snakeCase), toResponse(camelCase));
    });

    it('should return enforced decimals for single entry', function() {
        process.env.ENFORCE_DECIMALS = true;

        assert.equal(
            '{"test1":1,"average_score":1.25}',
            toResponse(
                {
                    test1: 1,
                    averageScore: 1.25
                },
                ['averageScore']
            )
        );

        assert.equal(
            '{"test1":1,"average_score":1.25,"test2":2}',
            toResponse(
                {
                    test1: 1,
                    averageScore: 1.25,
                    test2: 2
                },
                ['averageScore']
            )
        );

        assert.equal(
            '{"test1":1,"average_score":1.0}',
            toResponse(
                {
                    test1: 1,
                    averageScore: 1.0
                },
                ['averageScore']
            )
        );

        assert.equal(
            '{"test1":1,"average_score":1.0,"test2":2}',
            toResponse(
                {
                    test1: 1,
                    averageScore: 1.0,
                    test2: 2
                },
                ['averageScore']
            )
        );

        process.env.ENFORCE_DECIMALS = false;
    });

    it('should return enforced decimals for multiple entries', function() {
        process.env.ENFORCE_DECIMALS = true;

        assert.equal(
            `[${[
                '{"test1":1,"average_score":1.25}',
                '{"test1":1,"average_score":1.25,"test2":2}',
                '{"test1":1,"average_score":1.0}',
                '{"test1":1,"average_score":1.0,"test2":2}'
            ].join(',')}]`,
            toResponse(
                [
                    {
                        test1: 1,
                        averageScore: 1.25
                    },
                    {
                        test1: 1,
                        averageScore: 1.25,
                        test2: 2
                    },
                    {
                        test1: 1,
                        averageScore: 1.0
                    },
                    {
                        test1: 1,
                        averageScore: 1.0,
                        test2: 2
                    }
                ],
                ['averageScore']
            )
        );

        process.env.ENFORCE_DECIMALS = false;
    });

    it('should respect the setting for enforced decimals', function() {
        process.env.ENFORCE_DECIMALS = false;

        assert.equal(
            '{"test1":1,"average_score":1}',
            toResponse(
                {
                    test1: 1,
                    averageScore: 1.0
                },
                ['averageScore']
            )
        );

        process.env.ENFORCE_DECIMALS = true;

        assert.equal(
            '{"test1":1,"average_score":1.0}',
            toResponse(
                {
                    test1: 1,
                    averageScore: 1.0
                },
                ['averageScore']
            )
        );

        process.env.ENFORCE_DECIMALS = false;
    });
});
