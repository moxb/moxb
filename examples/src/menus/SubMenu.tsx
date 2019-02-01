import { rootOrDetails, UIFragmentSpec } from '@moxb/antd';
import { StateSpace, NavigableContent } from '@moxb/moxb';
import * as React from 'react';
// @ts-ignore
import blueUrl from '../../images/blue_blocks.png';
// @ts-ignore
import greenUrl from '../../images/green_blocks.jpg';
// @ts-ignore
import oneUrl from '../../images/one_apple.jpg';
// @ts-ignore
import redUrl from '../../images/red_blocks.gif';
// @ts-ignore
import threeUrl from '../../images/three_apples.jpg';
// @ts-ignore
import twoUrl from '../../images/two_apples.jpg';
import { DetailDisplayer } from './DetailDisplayer';

export const subMenu1: StateSpace<string, UIFragmentSpec, {}> = [
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
        tokenMapping: ['something'],
        fragment: rootOrDetails({
            ifRoot: {
                fragment: (
                    <div>
                        Three apples: <br />
                        <img src={threeUrl} />
                    </div>
                ),
            },
            ifDetails: {
                fragment: DetailDisplayer,
            },
        }),
    },
    {
        key: 'thirty',
        label: 'Thirty something',
        // this is a default sub-stace group, so all these sub-states will have "thirty" in their path
        subStates: [
            {
                key: '',
                root: true,
                label: 'Thirty',
                fragment: <div>Number 30</div>,
            },
            {
                key: 'two',
                label: 'Thirty two',
                fragment: <div>Number 32</div>,
            },
            {
                key: 'three',
                label: 'Thirty three',
                fragment: <div>Number 33</div>,
            },
        ],
    },
    {
        key: 'more',
        label: 'Even more',
        flat: true, // this means that "more" won't be part of the path for these sub-states
        subStates: [
            {
                key: 'forty',
                label: 'Forty',
                fragment: <div>Number 40</div>,
            },
            {
                key: 'fifty',
                label: 'Fifty',
                fragment: <div>Number 50</div>,
            },
        ],
    },
];

class GreenBlocks extends React.Component<NavigableContent<string, UIFragmentSpec>> {
    componentDidMount(): void {
        const { navControl } = this.props;
        navControl.registerStateHooks({
            getLeaveQuestion: () => 'Do you really want to leave these nice green blocks?',
        });
    }

    render() {
        return (
            <div>
                {'(Mostly) green-ish blocks: '}
                <br />
                <img src={greenUrl} />
            </div>
        );
    }
}

export const subMenu2: StateSpace<string, UIFragmentSpec, {}> = [
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
        fragment: GreenBlocks,
    },
];
