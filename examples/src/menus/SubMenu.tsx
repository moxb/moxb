import * as React from 'react';
import { StateSpace } from '@moxb/moxb';

// @ts-ignore
import blueUrl from '../../images/blue_blocks.png';
// @ts-ignore
import oneUrl from '../../images/one_apple.jpg';
// @ts-ignore
import greenUrl from '../../images/green_blocks.jpg';
// @ts-ignore
import redUrl from '../../images/red_blocks.gif';
// @ts-ignore
import threeUrl from '../../images/three_apples.jpg';
// @ts-ignore
import twoUrl from '../../images/two_apples.jpg';

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
        key: 'thirty',
        label: 'Thirty something',
        hierarchical: true,
        subStates: [
            {
                key: '',
                root: true,
                label: 'Thirty',
                fragment: (
                    <div>
                        Three apples for 30: <br />
                        <img src={threeUrl} />
                    </div>
                ),
            },
            {
                key: 'two',
                label: 'Thirty two',
                fragment: (
                    <div>
                        Three apples for 32:
                        <br />
                        <img src={threeUrl} />
                    </div>
                ),
            },
            {
                key: 'three',
                label: 'Thirty three',
                fragment: (
                    <div>
                        Three apples for 33:
                        <br />
                        <img src={threeUrl} />
                    </div>
                ),
            },
        ],
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
