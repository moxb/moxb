import { UpdateMethod, UsesLocation, NavRef, UrlArg, MyLocation } from '@moxb/moxb';
import * as React from 'react';
interface RedirectProps {
    position?: number;
    /**
     * Where should be go? (List of path tokens.)
     *
     * Either this or location should be given.
     */
    to?: string[];
    updateMethod?: UpdateMethod;
    /**
     * If you want the original path to be saved, provide an UrlArg for that.
     * (Note that the arg should be permanent, in order to survive the path change.)
     */
    pathSaveArg?: UrlArg<MyLocation | null>;
    /**
     * Are we trying to restore a saved location? Then provide that location
     *
     * When supplied, this will override all other values.
     */
    location?: MyLocation;
}
export declare class Redirect extends React.Component<UsesLocation & RedirectProps> {
    componentDidMount(): void;
    render(): JSX.Element;
}
export declare const redirect: (props: RedirectProps) => JSX.Element;
export declare const redirectTo: (to: string[]) => JSX.Element;
export declare function redirectToNavRef<InputType>(navRef: NavRef<InputType>, tokens?: InputType, updateMethod?: UpdateMethod): JSX.Element;
export {};
