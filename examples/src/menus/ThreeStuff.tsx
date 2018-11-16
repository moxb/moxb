import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Navigable, UsesLocation, getNextPathToken, isTokenEmpty } from '@moxb/moxb';

// @ts-ignore
import threeUrl from '../../images/three_apples.jpg';

@inject('locationManager')
@observer
export class ThreeStuff extends React.Component<Navigable & UsesLocation> {
    public render() {
        const token = getNextPathToken(this.props);
        console.log('What should we do inside three apples?', token);
        if (isTokenEmpty(token)) {
            return (
                <div>
                    Three apples: <br />
                    <img src={threeUrl} />
                </div>
            );
        } else {
            return 'Three apples and ' + token;
        }
    }
}
