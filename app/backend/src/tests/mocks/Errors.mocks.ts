const AUTH_ERRORS = {
    messages: {
        missingField: 'All fields must be filled',
        invalidField: 'Incorrect email or password',
        invalidToken: 'Token must be a valid token',
        missingToken: 'Must provide credentials'
    }
};

const GENERAL_ERROR = new Error('Any error without a code');

export {
AUTH_ERRORS,
GENERAL_ERROR,
}