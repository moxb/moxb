import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { ApplicationHTML } from './app/ApplicationHTML';

import { StoreImpl } from './store/Store';

const model = new StoreImpl();
(window as any).model = model;
(window as any).store = model;

class App extends React.Component {
    render() {
        return (
            <>
                <Provider {...model}>
                    <ApplicationHTML />
                </Provider>
            </>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('example-app'));
