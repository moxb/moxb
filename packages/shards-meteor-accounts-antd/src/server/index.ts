import { PATH } from '../api/paths';

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