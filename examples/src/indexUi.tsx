import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { MiniRouterUi } from './mini-router/MiniRouterUi';
import { StoreImpl } from './store/Store';
import { MiniRouter } from './mini-router/MiniRouter';

const store = new StoreImpl();
(window as any).store = store;
(window as any).view = store.view;

new MiniRouter(store);

class App extends React.Component {
    render() {
        return (
            <>
                <Provider {...store}>
                    <MiniRouterUi />
                </Provider>
            </>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('example-app'));
