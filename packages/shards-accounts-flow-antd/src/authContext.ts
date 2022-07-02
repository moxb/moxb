import { createGlobalContext } from '@moxb/react-html';
import { AuthBackend } from './AuthBackend';
import { useContext } from 'react';

const AuthBackendContext = createGlobalContext<AuthBackend | undefined>('auth backend', undefined);

export const AuthBackendProvider = AuthBackendContext.Provider;

export const useAuthBackend = () => {
    const backend = useContext(AuthBackendContext);
    if (!backend) {
        throw new Error(
            "Can't find the Authentication Backend in the context! Are you sure you are under the subtree wrapped by <WithLoginFlow>?"
        );
    }
    return backend;
};
