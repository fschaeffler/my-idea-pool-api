import lowerKeys from 'lowercase-keys-object';
import humps from 'humps';
import * as _ from 'underscore';

// WARN: formatting the JSON like this is not JSON-standard compliant anymore
// NOTE: this only works for JSON-objects without any hierarchies
const entryWithEnforcedDecimals = (json, enforcedDecimals) => {
    const result = ['{'];

    const keys = Object.keys(json);

    keys.forEach((key, index) => {
        const snakeCaseKey = humps.decamelize(key);

        if (enforcedDecimals.includes(key)) {
            const stringifiedDecimal = JSON.stringify({
                [snakeCaseKey]: json[key]
            }).slice(1, -1);

            result.push(stringifiedDecimal);

            if (!stringifiedDecimal.split(':')[1].includes('.')) {
                result.push('.0');
            }
        } else {
            result.push(
                JSON.stringify({ [snakeCaseKey]: json[key] }).slice(1, -1)
            );
        }

        if (index < keys.length - 1) {
            result.push(',');
        }
    });

    result.push('}');

    return result.join('');
};

const entriesWithEnforcedDecimals = (json, enforcedDecimals) =>
    `[${_.map(json, jsonEntry =>
        entryWithEnforcedDecimals(jsonEntry, enforcedDecimals)
    ).join(',')}]`;

const withEnforcedDecimals = (json, enforcedDecimals) => {
    if (Array.isArray(json)) {
        return entriesWithEnforcedDecimals(json, enforcedDecimals);
    }

    return entryWithEnforcedDecimals(json, enforcedDecimals);
};

const isEnforcedDecimalsEnabled = enforcedDecimals => {
    if (
        process.env.ENFORCE_DECIMALS !== true &&
        process.env.ENFORCE_DECIMALS !== 'true'
    ) {
        return false;
    }

    return !!enforcedDecimals.length;
};

export const toSnakeCase = json => humps.decamelizeKeys(json);
export const toLowerCase = json => lowerKeys(json);

export const toResponse = (json, enforcedDecimals = []) =>
    isEnforcedDecimalsEnabled(enforcedDecimals)
        ? withEnforcedDecimals(json, enforcedDecimals)
        : JSON.stringify(humps.decamelizeKeys(json));
