import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import { useStore } from '../store/Store';

export const NavigationUi = observer(() => {
    const { view } = useStore();
    return (
        <Menu mode="horizontal" style={{ lineHeight: '64px' }}>
            <Menu.Item key="components">
                <a
                    href={'/components/'}
                    onClick={(e) => {
                        e.preventDefault();
                        view.openIndexPage();
                        return false;
                    }}
                >
                    All components
                </a>
            </Menu.Item>
            <Menu.Item key="loginForm">
                <a
                    href={'/loginForm/'}
                    onClick={(e) => {
                        e.preventDefault();
                        view.openLoginFormPage();
                        return false;
                    }}
                >
                    Login Form
                </a>
            </Menu.Item>
            <Menu.Item key="memTable">
                <a
                    href={'/memTable/'}
                    onClick={(e) => {
                        e.preventDefault();
                        view.openMemTablePage();
                        return false;
                    }}
                >
                    Mem Table
                </a>
            </Menu.Item>
        </Menu>
    );
});
