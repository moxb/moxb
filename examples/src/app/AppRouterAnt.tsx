import { LocationDependentArea } from '@moxb/antd';

import { Layout, Row } from 'antd';
import * as React from 'react';
import { NavigationAnt } from '../common/NavigationAnt';

import { defaultContent, mainMenu } from '../MenuStructure';

export class AppRouterAnt extends React.Component {
    render() {
        return (
            <Layout>
                <Layout.Content>
                    <Row>
                        <NavigationAnt />
                    </Row>
                    <LocationDependentArea
                        id="main-area"
                        subStates={mainMenu}
                        fallback={defaultContent}
                        part="main"
                        useTokenMappings={true}
                    />
                    <hr />
                    <LocationDependentArea
                        id="footer-area"
                        subStates={mainMenu}
                        fallback={defaultContent}
                        part="bottom"
                    />
                </Layout.Content>
            </Layout>
        );
    }
}
