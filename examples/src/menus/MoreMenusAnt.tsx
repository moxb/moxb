import { MenuAndContentAnt, TextFormAnt, Link, ArgChangingLink, MultiArgChangingLink } from '@moxb/antd';
import { Navigable } from '@moxb/moxb';

import { Col, Row } from 'antd';
import { inject } from 'mobx-react';
import * as React from 'react';
import { subMenu1, subMenu2 } from './SubMenu';
import { UrlStore } from '../store/UrlStore';

@inject('url')
export class MoreMenusAnt extends React.Component<{ url?: UrlStore } & Navigable> {
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
                            fallback="Unknown number"
                            debug={false}
                        />
                    </Col>
                    <Col span={12}>
                        <div>And here is a text field</div>
                        <TextFormAnt operation={url!.bindSearch} />
                        <hr />
                        <Link to={['moreMenus', 'two']} label="Select 'two' on the left tab menu!" />
                        <hr />
                        <ArgChangingLink arg={url!.color!} value="blue" label="Set the color to blue!" />
                        <hr />
                        <MultiArgChangingLink
                            changes={[
                                {
                                    arg: url!.color,
                                    value: 'green',
                                },
                                {
                                    arg: url!.search,
                                    value: 'treasure',
                                },
                            ]}
                            label="Set color to green, search to gold!"
                        />
                        <hr />
                        <div>
                            This menu (on the right) is <i>not</i> part of the global navigation.
                        </div>
                        <MenuAndContentAnt
                            id="right-menu"
                            arg={url!.color}
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
