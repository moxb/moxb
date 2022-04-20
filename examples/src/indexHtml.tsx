import * as React from 'react';
import * as ReactDOM from 'react-dom';
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

ReactDOM.render(<App />, document.getElementById('example-app'));
