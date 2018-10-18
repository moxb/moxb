import { inject } from 'mobx-react';
import { Layout, Row, Col } from 'antd';
import * as React from 'react';
import { MenuAndContent } from '@moxb/antd';
import { MemTable, MemTableData } from './MemTable';

import {
    LocationManager,
    UrlArg, URLARG_TYPE_STRING,
} from '@moxb/moxb';

export const PATH = "moreMenus";

import oneUrl from "../../images/one_apple.jpg";
import twoUrl from "../../images/two_apples.jpg";
import threeUrl from "../../images/three_apples.jpg";

import blueUrl from "../../images/blue_blocks.png";
import redUrl from "../../images/red_blocks.gif";
import greenUrl from "../../images/green_blocks.jpg";

export const subMenu1: StateSpace = [
    {
        path: 'one',
        root: true,
        label: 'One',
        fragment: <div>One apple: <br/><img src={ oneUrl } /></div>,
    },
    {
        path: 'two',
        label: "Two",
        fragment: <div>Two apples: <br /><img src={ twoUrl } /></div>,
    },
    {
        path: 'three',
        label: 'Three',
        fragment: <div>Three apples: <br /><img src={ threeUrl } /></div>,
    },
];

export const subMenu2: StateSpace = [
    {
        path: 'red',
        label: 'Red',
        fragment: <div>Red blocks: <br/><img src={ redUrl } /></div>,
    },
    {
        path: 'blue',
        label: "Blue",
        fragment: <div>Blue blocks: <br /><img src={ blueUrl } /></div>,
    },
    {
        path: 'green',
        label: 'Green',
        fragment: <div>(Mostly) green blocks: <br /><img src={ greenUrl } /></div>,
    },
];

@inject("location", "color")
export class MoreMenusAnt extends React.Component<{ location?: LocationManager }> {
    
    render() {
        const { location, color } = this.props;
        const separator = location.pathSeparator;
        return (
            <div>
                <span>Here come some more menus.</span>
                <Row>
                    <Col span={12} >
                        <span>This menu (on the left) is part of the global navigation.</span>
                        <MenuAndContent
                            locationManager={location}
                            rootPath={ separator + PATH + separator }
                            substates={ subMenu1 }
                            fallback="Unknown number"
                        />
                    </Col>
                    <Col span={12} >
                        <span>This menu (on the right) is <i>not</i> part of the global navigation.</span>
                        <MenuAndContent
                            locationManager={location}
                            arg={ color }
                            substates={ subMenu2 }
                            fallback="Unknown color"
                            debug={ false }
                        />                
                    </Col>
                </Row>
            </div>
        );
    }
}
