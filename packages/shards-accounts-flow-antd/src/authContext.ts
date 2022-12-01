import { createGlobalContext } from '@moxb/data-hooks';
import { useContext } from 'react';
import { AuthenticationLogic } from './AuthenticationLogic';

const AuthenticationLogicContext = createGlobalContext<AuthenticationLogic | undefined>('auth backend', undefined);

export const AuthenticationLogicProvider = AuthenticationLogicContext.Provider;

export const useAuthenticationLogic = () => {
    const logic = useContext(AuthenticationLogicContext);
    if (!logic) {
        throw new Error(
            "Can't find the Authentication Logic in the context! Are you sure you are under the subtree wrapped by <WithLoginFlow>?"
        );
    }
    return logic;
};
