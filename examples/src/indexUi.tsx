import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppRouterUi } from './app/AppRouterUi';
import { createStore, StoreProvider } from './store/Store';

const store = createStore();
(window as any).model = store;
(window as any).store = store;
(window as any).view = store.view;

const App = () => (
    <>
        <StoreProvider value={store}>
            <AppRouterUi />
        </StoreProvider>
    </>
);

ReactDOM.render(<App />, document.getElementById('example-app'));
