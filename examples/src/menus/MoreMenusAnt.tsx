import { Navigable, MenuAndContentAnt, TextFormAnt, Link, ArgChangingLink } from '@moxb/antd';
import { StateSpace } from '@moxb/moxb';
import { Col, Row } from 'antd';
import { inject } from 'mobx-react';
import * as React from 'react';

import blueUrl from '../../images/blue_blocks.png';
import oneUrl from '../../images/one_apple.jpg';
import greenUrl from '../../images/green_blocks.jpg';
import redUrl from '../../images/red_blocks.gif';
import threeUrl from '../../images/three_apples.jpg';
import twoUrl from '../../images/two_apples.jpg';
import { UrlStore } from '../store/UrlStore';

export const subMenu1: StateSpace = [
    {
        key: 'one',
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
        key: 'two',
        label: 'Two',
        fragment: (
            <div>
                Two apples: <br />
                <img src={twoUrl} />
            </div>
        ),
    },
    {
        key: 'three',
        label: 'Three',
        /*
        subStates: [
            {
                key: 'foo',
                root: true,
                label: 'Thirty foo',
                fragment: (
                        <div>
                            Three apples for once: <br />
                            <img src={threeUrl} />
                        </div>
                ),
            },
            {
                key: 'bar',
                label: 'Thirty bar',
                fragment: (
                        <div>
                            Three apples for twice:<br />
                            <img src={threeUrl} />
                        </div>
                ),
            },
        ],
        */
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
        key: 'red',
        label: 'Red',
        fragment: (
            <div>
                Red blocks: <br />
                <img src={redUrl} />
            </div>
        ),
    },
    {
        key: 'blue',
        label: 'Blue',
        fragment: (
            <div>
                Blue blocks: <br />
                <img src={blueUrl} />
            </div>
        ),
    },
    {
        key: 'green',
        label: 'Green',
        fragment: (
            <div>
                {'(Mostly) green blocks: '}
                <br />
                <img src={greenUrl} />
            </div>
        ),
    },
];

@inject('url')
export class MoreMenusAnt extends React.Component<{ url?: UrlStore } & Navigable> {
    render() {
        const { location, url } = this.props;
        return (
            <div>
                <span>Here come some more menus.</span>
                <Row>
                    <Col span={12}>
                        <span>This menu (on the left) is part of the global navigation.</span>
                        <MenuAndContentAnt
                            parsedTokens={this.props.parsedTokens}
                            substates={subMenu1}
                            fallback="Unknown number"
                        />
                    </Col>
                    <Col span={12}>
                        <div>And here is a text field</div>
                        <TextFormAnt operation={url!.bindSearch} />
                        <hr />
                        <Link pathTokens={['moreMenus', 'two']} label="Select 'two' on the left tab menu!" />
                        <hr />
                        <ArgChangingLink arg={url.color} value="blue" label="Set the color to blue!" />
                        <hr />
                        <div>
                            This menu (on the right) is <i>not</i> part of the global navigation.
                        </div>
                        <MenuAndContentAnt
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
