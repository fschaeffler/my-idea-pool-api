# My Idea Pool API

## Development Setup

## Tests

## Deployment

## Improvements

### Performance

-   Switch from snake-case (`my_json_field`) to camel-case (`myJsonField`) in order to save transferred data between the client and the API. The saved amount of transferred data depends on the project. However, the more numeric and boolean fields are included in the JSON-responses, the more the data-saving will be. On average, a saving of 15% transferred data is common.

### Security

-   Don't send cleartext passwords to the API. In order to fix this, the client needs to hash its password locally and then send the hash and not the password itself to the API.

### Data Privacy

-   In order to comply with data privacy matters, there should always be a self-deletion process for the user. This would need an API-endpoint for self-deleting an authorized user.
