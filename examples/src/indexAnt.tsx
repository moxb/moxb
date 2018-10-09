import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { AppRouterAnt } from './app/AppRouterAnt';
import { StoreImpl } from './store/Store';

const store = new StoreImpl();
(window as any).store = store;
(window as any).view = store.view;

class App extends React.Component {
    render() {
        return (
            <>
                <Provider {...store}>
                    <AppRouterAnt />
                </Provider>
            </>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('example-app'));
