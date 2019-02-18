import { LinkAnt, MenuAndContentAnt, TextFormAnt, UIFragmentSpec, NavTabBarAnt } from '@moxb/antd';
import { Navigable } from '@moxb/moxb';

import { Col, Row } from 'antd';
import { inject } from 'mobx-react';
import * as React from 'react';
import { UrlStore } from '../store/UrlStore';
import { subMenu1, subMenu2 } from './SubMenu';

@inject('url')
export class MoreMenusAnt extends React.Component<{ url?: UrlStore } & Navigable<any, UIFragmentSpec>> {
    render() {
        const { url } = this.props;
        return (
            <div>
                <span>Here come some more menus.</span>
                <Row>
                    <Col span={12}>
                        <span>This menu (on the left) is part of the global navigation.</span>
                        <MenuAndContentAnt
                            id="left-menu"
                            parsedTokens={this.props.parsedTokens}
                            // arg={url!.number}
                            subStates={subMenu1}
                            mode="horizontal"
                            useTokenMappings={true}
                            fallback="Unknown number"
                            debug={false}
                        />
                    </Col>
                    <Col span={12}>
                        <div>And here is a text field</div>
                        <TextFormAnt operation={url!.bindSearch} />
                        <hr />
                        <LinkAnt
                            widgetStyle="button"
                            to={['moreMenus', 'two']}
                            argChanges={[{ arg: url!.color, value: 'green' }]}
                            label="Select 'two' on the left tab menu, and green color on the right one!"
                            buttonProps={{ type: 'primary' }}
                        />
                        <hr />
                        <LinkAnt argChanges={[{ arg: url!.color!, value: 'blue' }]} label="Set the color to blue!" />
                        <hr />
                        <LinkAnt
                            argChanges={[
                                {
                                    arg: url!.color,
                                    value: 'green',
                                },
                                {
                                    arg: url!.search,
                                    value: 'treasure',
                                },
                            ]}
                            label="Set color to green, and search for treasure!"
                        />
                        <hr />
                        <div>
                            This menu (on the right) is <i>not</i> part of the global navigation.
                        </div>
                        <NavTabBarAnt
                            id="right-menu"
                            arg={url!.color}
                            mode="left"
                            subStates={subMenu2}
                            fallback="Unknown color"
                            debug={false}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}
