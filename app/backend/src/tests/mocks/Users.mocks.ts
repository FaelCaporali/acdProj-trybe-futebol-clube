const FAKE_USER = { id: 1, username: 'admin', email: 'admin@admin.com', password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW', role: 'admin' }
const GOOD_CREDENTIALS = { email: 'admin@admin.com', password: 'secret_admin' };
const MISSING_EMAIL_CREDENTIALS = { password: 'secret_admin' };
const INVALID_EMAIL_USER = { email: 'admin', password: 'secret_admin' };
const MISSING_PASSWORD_USER = { email: 'admin@admin.com' }
const INVALID_MIN_LENGTH_PASSWORD = { email: 'admin@admin.com', password: 'asd' };
const NON_REGISTERED_USER = { email: 'socrates@admin.com', password: 'asdSDS' };
const BAD_CREDENTIALS = { email: 'admin@admin.com', password: 'my_secret_admin' };

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