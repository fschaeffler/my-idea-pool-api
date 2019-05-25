import * as snakeCase from 'snakecase-keys';

export const toSnakeCase = json => snakeCase(json);
export const toResponse = json => JSON.stringify(snakeCase(json));
