import { Layout, Row } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { NavigationAnt } from '../common/NavigationAnt';
import { LoginFormAnt } from '../form/LoginFormAnt';
import { MemTableAnt } from '../memtable/MemTableAnt';
import { ApplicationAnt } from './ApplicationAnt';

import { LocationManager } from '@moxb/moxb';
import { LocationDependentContent } from '@moxb/antd';

import { mainMenu, missingContent } from '../MenuStructure.tsx';

@inject('location')
export class AppRouterAnt extends React.Component<{ location?: LocationManager }> {
    render() {
        return (
            <Layout>
                <Layout.Content>
                    <Row>
                        <NavigationAnt />
                    </Row>
                    <LocationDependentContent
                        locationManager={this.props.location}
                        substates={mainMenu}
                        fallback={missingContent}
                    />
                </Layout.Content>
            </Layout>
        );
    }
}
