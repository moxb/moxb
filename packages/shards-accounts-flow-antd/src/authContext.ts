import { createGlobalContext } from '@moxb/react-html';
import { AuthBackend } from './AuthBackend';
import { useContext } from 'react';

const AuthBackendContext = createGlobalContext<AuthBackend | undefined>('auth backend', undefined);

export const AuthBackendProvider = AuthBackendContext.Provider;

export const useAuthBackend = () => useContext(AuthBackendContext);
