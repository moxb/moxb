import { UpdateMethod, UsesLocation, NavRef, UrlArg, MyLocation } from '@moxb/moxb';
import { inject, observer } from 'mobx-react';
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

export const Redirect = inject('locationManager')(
    observer(class Redirect extends React.Component<UsesLocation & RedirectProps> {
        public componentDidMount() {
            const { locationManager, position = 0, to, updateMethod, pathSaveArg, location } = this.props;
            if (location) {
                locationManager!.doSetLocation(location, UpdateMethod.REPLACE);
                return;
            }
            if (pathSaveArg) {
                pathSaveArg.doSet(locationManager!.location);
            }
            if (to !== undefined) {
                // An empty list is a valid input here, so we can't simply test for falsy
                locationManager!.doSetPathTokens(position, to, updateMethod);
            }
        }

        render() {
            return <div>Redirecting ... </div>;
        }
    })
);

export const redirect = (props: RedirectProps) => <Redirect {...props} />;

export const redirectTo = (to: string[]) => redirect({ to });

export function redirectToNavRef<InputType>(
    navRef: NavRef<InputType>,
    tokens?: InputType,
    updateMethod?: UpdateMethod
) {
    const link = navRef.createDirectLink(tokens);
    return redirect({
        to: link.pathTokens,
        updateMethod,
    });
}
