import * as React from 'react';
import { inject } from 'mobx-react';
import { Col, Row } from 'antd';
import { setArg } from '@moxb/moxb';
import { NavigableUIContent } from '@moxb/html';
import { NavLink, NavLinkButtonAnt, MenuAndContentAnt, TextFormAnt, NavTabBarAnt } from '@moxb/antd';

import { UrlStore } from '../store/UrlStore';
import { subMenu1, subMenu2 } from './SubMenu';

@inject('url')
export class MoreMenusAnt extends React.Component<{ url?: UrlStore } & NavigableUIContent> {
    render() {
        const { url, navControl } = this.props;
        const { color, search } = url!;
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
                            stateSpace={subMenu1}
                            navControl={navControl}
                            mode="horizontal"
                            useTokenMappings={true}
                            debug={false}
                        />
                    </Col>
                    <Col span={12}>
                        <div>And here is a text field</div>
                        <TextFormAnt operation={url!.bindSearch} />
                        <hr />
                        <NavLinkButtonAnt
                            to={['moreMenus', 'two']}
                            argChanges={[setArg(color, 'green')]}
                            label="Select 'two' on the left tab menu, and green color on the right one!"
                            buttonProps={{ type: 'primary' }}
                        />
                        <hr />
                        <NavLink argChanges={[setArg(color!, 'blue')]} label="Set the color to blue!" />
                        <hr />
                        <NavLink
                            argChanges={[setArg(color, 'green'), setArg(search, 'treasure')]}
                            label="Set color to green, and search for treasure!"
                        />
                        <hr />
                        <div>
                            This menu (on the right) is <i>not</i> part of the global navigation.
                        </div>
                        <NavTabBarAnt
                            id="right-menu"
                            arg={color}
                            mode="left"
                            stateSpace={subMenu2}
                            navControl={navControl}
                            debug={false}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}
