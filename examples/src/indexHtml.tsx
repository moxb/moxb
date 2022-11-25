import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ApplicationHTML } from './app/ApplicationHTML';

import { createStore, StoreProvider } from './store/Store';

const store = createStore();
(window as any).model = store;
(window as any).store = store;

const App = () => (
    <>
        <StoreProvider value={store}>
            <ApplicationHTML />
        </StoreProvider>
    </>
);

createRoot(document.getElementById('example-app')!).render(<App />);
