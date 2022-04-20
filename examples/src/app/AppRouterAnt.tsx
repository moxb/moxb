import * as React from 'react';
import { Layout, Row } from 'antd';

import { LocationDependentArea } from '@moxb/html';
import { NavMenuBarAnt } from '@moxb/antd';

import { mainMenu } from '../MenuStructure';

export const AppRouterAnt = () => (
    <Layout>
        <Layout.Content>
            <Row>
                <NavMenuBarAnt id="main-menu" stateSpace={mainMenu} />
            </Row>
            <LocationDependentArea id="main-area" stateSpace={mainMenu} part="main" useTokenMappings={true} />
            <hr />
            <LocationDependentArea id="footer-area" stateSpace={mainMenu} part="bottom" />
        </Layout.Content>
    </Layout>
);
