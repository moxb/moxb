import { inject } from 'mobx-react';
import { Row, Col } from 'antd';
import * as React from 'react';
import { MenuAndContent } from '@moxb/antd';
import { MemTable, MemTableData } from './MemTable';

import { LocationManager } from '@moxb/moxb';

export const PATH = "moreMenus";

import oneUrl from "../../images/one_apple.jpg";
import twoUrl from "../../images/two_apples.jpg";
import threeUrl from "../../images/three_apples.jpg";

export const subMenu1: StateSpace = [
    {
        path: 'one',
        root: true,
        label: 'One',
        fragment: <img src={ oneUrl } />,
    },
    {
        path: 'two',
        label: "Two",
        fragment: <img src={ twoUrl } />,
    },
    {
        path: 'three',
        label: 'Three',
        fragment: <img src={ threeUrl } />,
    },
];

@inject('location')
export class MoreMenusAnt extends React.Component<{ location?: LocationManager }> {
    render() {
        const { location } = this.props;
        const separator = location.pathSeparator;
        return (
            <div>
                <span>Here come some more menus.</span>
                <Row>
                    <Col span={12} >
                        <span>This menu is part of the global navigation.</span>
                        <MenuAndContent
                            locationManager={location}
                            rootPath={ separator + PATH + separator }
                            substates={ subMenu1 }
                            fallback="Missing content"
                        />
                    </Col>
                    <Col span={12} >
                        Part 2
                    </Col>
                </Row>
            </div>
        );
    }
}
