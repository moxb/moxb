import { MenuAndContent, TextFormAnt } from '@moxb/antd';
import { LocationManager, StateSpace } from '@moxb/moxb';
import { Col, Row } from 'antd';
import { inject } from 'mobx-react';
import * as React from 'react';

import blueUrl from '../../images/blue_blocks.png';
import oneUrl from '../../images/one_apple.jpg';
import redUrl from '../../images/red_blocks.gif';
import threeUrl from '../../images/three_apples.jpg';
import twoUrl from '../../images/two_apples.jpg';
import { UrlStore } from '../store/UrlStore';

export const PATH = 'moreMenus';

export const subMenu1: StateSpace = [
    {
        path: 'one',
        root: true,
        label: 'One',
        fragment: (
            <div>
                One apple: <br />
                <img src={oneUrl} />
            </div>
        ),
    },
    {
        path: 'two',
        label: 'Two',
        fragment: (
            <div>
                Two apples: <br />
                <img src={twoUrl} />
            </div>
        ),
    },
    {
        path: 'three',
        label: 'Three',
        fragment: (
            <div>
                Three apples: <br />
                <img src={threeUrl} />
            </div>
        ),
    },
];

export const subMenu2: StateSpace = [
    {
        path: 'red',
        label: 'Red',
        fragment: (
            <div>
                Red blocks: <br />
                <img src={redUrl} />
            </div>
        ),
    },
    {
        path: 'blue',
        label: 'Blue',
        fragment: (
            <div>
                Blue blocks: <br />
                <img src={blueUrl} />
            </div>
        ),
    },
    {
        path: 'green',
        label: 'Green',
        fragment: (
            <div>
                {'(Mostly) green blocks: '}
                <br />
                <img src={blueUrl} />
            </div>
        ),
    },
];

@inject('location', 'url')
export class MoreMenusAnt extends React.Component<{ location?: LocationManager; url?: UrlStore }> {
    render() {
        const { location, url } = this.props;
        const separator = location!.pathSeparator;
        return (
            <div>
                <span>Here come some more menus.</span>
                <Row>
                    <Col span={12}>
                        <span>This menu (on the left) is part of the global navigation.</span>
                        <MenuAndContent
                            locationManager={location!}
                            rootPath={separator + PATH + separator}
                            substates={subMenu1}
                            fallback="Unknown number"
                        />
                    </Col>
                    <Col span={12}>
                        <div>And here is a text field</div>
                        <TextFormAnt operation={url!.bindSearch} />
                        <div>
                            This menu (on the right) is <i>not</i> part of the global navigation.
                        </div>
                        <MenuAndContent
                            locationManager={location!}
                            arg={url!.color}
                            substates={subMenu2}
                            fallback="Unknown color"
                            debug={false}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}
