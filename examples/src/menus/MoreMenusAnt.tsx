import * as React from 'react';
import { Col, Row } from 'antd';
import { TextFormAnt } from '@moxb/antd';

import { NavLink, NavigableUIContent, setArg } from '@moxb/stellar-router-react';
import { NavLinkButtonAnt, MenuAndContentAnt, NavTabBarAnt } from '@moxb/stellar-router-antd';

import { subMenu1, subMenu2 } from './SubMenu';
import { useStore } from '../store/Store';

export const MoreMenusAnt = (props: NavigableUIContent) => {
    const { url } = useStore();
    const { navControl, parsedTokens } = props;
    const { color, search } = url!;
    return (
        <div>
            <span>Here come some more menus.</span>
            <Row>
                <Col span={12}>
                    <span>This menu (on the left) is part of the global navigation.</span>
                    <MenuAndContentAnt
                        id="left-menu"
                        parsedTokens={parsedTokens}
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
};
