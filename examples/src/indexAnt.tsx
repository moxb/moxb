import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { StellarRouterProvider } from '@moxb/stellar-router-react';

import { AppRouterAnt } from './app/AppRouterAnt';
import { StoreProvider, createStore } from './store/Store';

const store = createStore();
(window as any).model = store;
(window as any).store = store;

const App = () => (
    <StoreProvider value={store}>
        <StellarRouterProvider store={store}>
            <AppRouterAnt />
        </StellarRouterProvider>
    </StoreProvider>
);

createRoot(document.getElementById('example-app')!).render(<App />);
