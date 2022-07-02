import * as React from 'react';

import { LOGIN_SYSTEM_PATH as PATH } from '../common/paths';

import { NavLink } from '@moxb/stellar-router-react';

export const getLinks = () => ({
    login: <NavLink to={[PATH.login]}>Sign in</NavLink>,
    register: <NavLink to={[PATH.register]}>Sign up</NavLink>,
    forgotPassword: <NavLink to={[PATH.forgotPassword]}>Forgot password?</NavLink>,
});
