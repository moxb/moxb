import { observable } from 'mobx';
import { getNextPathToken, LinkGenerator, Navigable, parseNavRef, UpdateMethod, UsesLocation } from '@moxb/moxb';
import { inject, observer } from 'mobx-react';
import * as React from 'react';

/**
 * The NavRefRedirect component is responsible for executing redirects based on base64-encoded
 * NavRef links.
 *
 * Just put it into a menu (under the preferred url prefix used for the redirects),
 * and it will handle the rest. Ie.
 *
 *  {
 *     key: 'redirects',
 *     hidden: true,
 *     fragment: NavRefRedirect,
 *  },
 *
 */
@inject('locationManager', 'linkGenerator')
@observer
export class NavRefRedirect extends React.Component<
    UsesLocation & Navigable<any, any> & { linkGenerator: LinkGenerator }
> {
    @observable
    private _failed = false;

    private _tryRedirect() {
        this._failed = false;
        try {
            // Get the data out of the next path token
            const stringForm = getNextPathToken(this.props);

            // Parse the base64 data into a NavRefCall data structure
            const { navRef, tokens } = parseNavRef(stringForm);

            // Go to this NavRef
            this.props.linkGenerator.doGoTo(navRef.call(tokens), UpdateMethod.REPLACE);
        } catch (e) {
            this._failed = true;
            console.log(e);
        }
    }

    componentDidMount() {
        this._tryRedirect();
    }

    componentDidUpdate() {
        this._tryRedirect();
    }

    render() {
        return this._failed ? <div>Oops! This redirect doesn't seem to be working.</div> : <div>Redirecting...</div>;
    }
}
