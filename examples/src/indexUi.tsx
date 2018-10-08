import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { ApplicationUi } from './ApplicationUi';
import { StoreImpl } from './store/Store';

const model = new StoreImpl();
(window as any).model = model;
(window as any).store = model;
(window as any).view = model.view;

class App extends React.Component {
    render() {
        return (
            <>
                <Provider {...model}>
                    <ApplicationUi />
                </Provider>
            </>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('example-app'));
