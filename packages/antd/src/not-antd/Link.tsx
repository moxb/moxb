import * as React from "react";
import { inject, observer } from "mobx-react";
import * as Anchor from "./Anchor";
import { UsesLocation } from "@moxb/moxb";

export interface LinkParams extends Anchor.AnchorParams {
    // The path tokens to set
    pathTokens: string[];

    // Set the number of tokens to be preserved.
    // further tokens will be dropped.
    position?: number;
}

type LinkProps = LinkParams & Anchor.Events;

@inject( 'locationManager' )
@observer
export class Link extends React.Component<LinkProps & UsesLocation> {

    public constructor(props: LinkProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    protected handleClick() {
        const {
            locationManager,
            pathTokens, position,
        } = this.props;
        locationManager!.pushPathTokens(position || 0, pathTokens);
    }

    public render() {
        const {
            locationManager,
            pathTokens, position,
            children,
                ... remnants
        } = this.props;
        const url = locationManager!.getURLForPathTokens(position || 0, pathTokens);
        const anchorProps: Anchor.UIProps = {
                ...remnants,
            href: url,
            onClick: this.handleClick,
        };
        return (
            <Anchor.Anchor {...anchorProps} >
                { children }
            </Anchor.Anchor>
        );
    }
}
