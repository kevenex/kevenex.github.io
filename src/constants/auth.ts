/**
 * SHA-256 hex digest of the access password — never the password itself.
 * Regenerate with: node -e "console.log(require('crypto').createHash('sha256').update('yourpassword').digest('hex'))"
 */
export const PASSWORD_HASH = 'fe2f72b1efefb006d56bd01780be2eba49db1885a157f6f4f0a06ed02f4cf20d';

export const SITE_ACCESS_KEY = 'site-access';
