const AUTH_ERRORS = {
    messages: {
        missingField: 'All fields must be filled',
        invalidField: 'Incorrect email or password',
        invalidToken: 'Token must be a valid token',
        missingToken: 'Must provide credentials',
    }
};

const MATCHES_ERRORS = {
    messages: {
        doubledTeamError: "It is not possible to create a match with two equal teams",
        notFoundTeam: "There is no team with such id!",
        generalError: "Internal server error",
    }
}

const TESTING_ERROR = new Error('Any error without a code');

export {
AUTH_ERRORS,
TESTING_ERROR as GENERAL_ERROR,
MATCHES_ERRORS,
}