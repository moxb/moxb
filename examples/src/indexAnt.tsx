import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { RoutingProvider } from '@moxb/stellar-router-react';

import { AppRouterAnt } from './app/AppRouterAnt';
import { StoreProvider, createStore } from './store/Store';

const store = createStore();
(window as any).model = store;
(window as any).store = store;

const App = () => (
    <StoreProvider value={store}>
        <RoutingProvider store={store}>
            <AppRouterAnt />
        </RoutingProvider>
    </StoreProvider>
);

ReactDOM.render(<App />, document.getElementById('example-app'));
