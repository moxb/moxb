import * as React from 'react';

import { PATH } from '../../api/paths';

import { NavLink } from '@moxb/stellar-router-react';

export const loginLink = <NavLink to={[PATH.login]}>Sign in</NavLink>;
export const registerLink = <NavLink to={[PATH.register]}>Sign up</NavLink>;
export const forgotPasswordLink = <NavLink to={[PATH.forgotPassword]}>Forgot password?</NavLink>;
