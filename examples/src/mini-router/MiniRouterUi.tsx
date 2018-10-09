import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { LoginFormUi } from '../form/LoginFormUi';
import { MemTableUi } from '../memtable/MemTableUi';
import { ViewStore } from '../store/ViewStore';
import { ApplicationUi } from '../app/ApplicationUi';

@inject('view')
@observer
export class MiniRouterUi extends React.Component<{ view?: ViewStore }> {
    render() {
        const view = this.props.view!;
        return renderContents(view);
    }
}

function renderContents(view: ViewStore) {
    switch (view.page) {
        case 'index':
            return <ApplicationUi />;
        case 'loginForm':
            return <LoginFormUi />;
        case 'memTable':
            return <MemTableUi />;
    }
}
