import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { AppRouterUi } from './app/AppRouterUi';
import { StoreImpl } from './store/Store';
import { MiniRouter } from './store/MiniRouter';

const store = new StoreImpl();
(window as any).store = store;
(window as any).view = store.view;

new MiniRouter(store);

class App extends React.Component {
    render() {
        return (
            <>
                <Provider {...store}>
                    <AppRouterUi />
                </Provider>
            </>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('example-app'));
