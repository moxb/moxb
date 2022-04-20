import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { LoginFormUi } from '../form/LoginFormUi';
import { MemTableUi } from '../memtable/MemTableUi';
import { ApplicationUi } from './ApplicationUi';
import { useStore } from '../store/Store';

export const AppRouterUi = observer(() => {
    const { view } = useStore();
    switch (view.page) {
        case 'index':
            return <ApplicationUi />;
        case 'loginForm':
            return <LoginFormUi />;
        case 'memTable':
            return <MemTableUi />;
        default:
            return null;
    }
});
