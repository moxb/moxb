import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { LoginFormAnt } from '../form/LoginFormAnt';
import { MemTableAnt } from '../memtable/MemTableAnt';
import { ApplicationAnt } from '../app/ApplicationAnt';
import { ViewStore } from '../store/ViewStore';

@inject('view')
@observer
export class MiniRouterAnt extends React.Component<{ view?: ViewStore }> {
    render() {
        const view = this.props.view!;
        return renderContents(view);
    }
}

function renderContents(view: ViewStore) {
    switch (view.page) {
        case 'index':
            return <ApplicationAnt />;
        case 'loginForm':
            return <LoginFormAnt />;
        case 'memTable':
            return <MemTableAnt />;
    }
}
