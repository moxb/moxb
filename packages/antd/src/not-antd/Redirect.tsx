import { UpdateMethod, UsesLocation } from '@moxb/moxb';
import { inject, observer } from 'mobx-react';
import * as React from 'react';

interface RedirectProps {
    position?: number;
    to: string[];
    updateMethod?: UpdateMethod;
}

@inject('locationManager')
@observer
export class Redirect extends React.Component<UsesLocation & RedirectProps> {
    public componentDidMount() {
        const { locationManager, position = 0, to, updateMethod } = this.props;
        locationManager!.doSetPathTokens(position, to, updateMethod);
    }

    render() {
        return <div>Redirecting to {this.props.to.join('/')} ... </div>;
    }
}

export const redirect = (props: RedirectProps) => <Redirect {...props} />;

export const redirectTo = (to: string[]) => redirect({ to });
