import { LOGIN_SYSTEM_PATH as PATH } from '../common/paths';

/**
 * Set up paths for verifying email addresses and password resets
 */
export function setupUserAccounts() {
    Accounts.urls.verifyEmail = function (token: string) {
        return Meteor.absoluteUrl(PATH.verifyEmail + '?token=' + token);
    };
    Accounts.urls.resetPassword = function (token: string) {
        return Meteor.absoluteUrl(PATH.resetPassword + '?token=' + token);
    };

    // console.log('Configured email paths');
    // Accounts.urls.enrollAccount = function (token: string) {
    //     return Meteor.absoluteUrl('enroll-account?token=' + token);
    // };
}
