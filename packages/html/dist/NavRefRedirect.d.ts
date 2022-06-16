import { UsesLinkGenerator, Navigable, UsesLocation } from '@moxb/moxb';
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
export declare class NavRefRedirect extends React.Component<UsesLocation & Navigable<any, any> & UsesLinkGenerator> {
    private _failed;
    private _tryRedirect;
    componentDidMount(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
}
