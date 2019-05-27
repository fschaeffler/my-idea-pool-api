import * as snakeCase from 'snakecase-keys';
import * as lowerCase from 'lowercase-keys';

export const toSnakeCase = json => snakeCase(json);
export const toLowerCase = json => lowerCase(json);
export const toResponse = json => JSON.stringify(snakeCase(json));
