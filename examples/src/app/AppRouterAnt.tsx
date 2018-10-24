import { Layout, Row } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { NavigationAnt } from '../common/NavigationAnt';
import { LoginFormAnt } from '../form/LoginFormAnt';
import { MemTableAnt } from '../memtable/MemTableAnt';
import { ApplicationAnt } from './ApplicationAnt';

import { LocationManager } from '@moxb/moxb';
import { LocationDependentContent } from '@moxb/antd';

import { mainMenu, defaultContent } from '../MenuStructure.tsx';

export class AppRouterAnt extends React.Component<{ location?: LocationManager }> {
    render() {
        return (
            <Layout>
                <Layout.Content>
                    <Row>
                        <NavigationAnt />
                    </Row>
                    <LocationDependentContent substates={mainMenu} fallback={defaultContent} part="main" />
                    <hr />
                    <LocationDependentContent substates={mainMenu} fallback={defaultContent} part="bottom" />
                </Layout.Content>
            </Layout>
        );
    }
}
