import { Layout, Row } from 'antd';
import * as React from 'react';
import { NavigationAnt } from '../common/NavigationAnt';

import { LocationManager } from '@moxb/moxb';
import { LocationDependentArea } from '@moxb/antd';

import { defaultContent, mainMenu } from '../MenuStructure';

export class AppRouterAnt extends React.Component<{ location?: LocationManager }> {
    render() {
        return (
            <Layout>
                <Layout.Content>
                    <Row>
                        <NavigationAnt />
                    </Row>
                    <LocationDependentArea subStates={mainMenu} fallback={defaultContent} part="main" />
                    <hr />
                    <LocationDependentArea subStates={mainMenu} fallback={defaultContent} part="bottom" />
                </Layout.Content>
            </Layout>
        );
    }
}
