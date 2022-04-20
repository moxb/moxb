import { LocationDependentArea } from '@moxb/antd';

import { Layout, Row } from 'antd';
import * as React from 'react';
import { NavigationAnt } from '../common/NavigationAnt';

import { mainMenu } from '../MenuStructure';

export class AppRouterAnt extends React.Component {
    render() {
        return (
            <Layout>
                <Layout.Content>
                    <Row>
                        <NavigationAnt />
                    </Row>
                    <LocationDependentArea id="main-area" stateSpace={mainMenu} part="main" useTokenMappings={true} />
                    <hr />
                    <LocationDependentArea id="footer-area" stateSpace={mainMenu} part="bottom" />
                </Layout.Content>
            </Layout>
        );
    }
}
