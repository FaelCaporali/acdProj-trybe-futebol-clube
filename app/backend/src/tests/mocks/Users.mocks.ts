const FAKE_USER = { id: 1, username: 'user', email: 'user@user.com', password: 'secret_user', role: 'user' }
const GOOD_CREDENTIALS = { email: 'user@user.com', password: 'secret_user' };
const MISSING_EMAIL_CREDENTIALS = { password: 'secret_user' };
const INVALID_EMAIL_USER = { email: 'user', password: 'secret_user' };
const MISSING_PASSWORD_USER = { email: 'user@user.com' }
const INVALID_MIN_LENGTH_PASSWORD = { email: 'user@user.com', password: 'asd' };
const NON_REGISTERED_USER = { email: 'socrates@admin.com', password: 'asdSDS' };
const BAD_CREDENTIALS = { email: 'user@user.com', password: 'my_secret_user' };

export {
    FAKE_USER,
    GOOD_CREDENTIALS,
    MISSING_EMAIL_CREDENTIALS,
    INVALID_EMAIL_USER,
    MISSING_PASSWORD_USER,
    INVALID_MIN_LENGTH_PASSWORD,
    NON_REGISTERED_USER,
    BAD_CREDENTIALS,
}