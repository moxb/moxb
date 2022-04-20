import { CoreLinkProps, locationToUrl, UsesLocation, MyLocation } from '@moxb/moxb';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import * as Anchor from './Anchor';

/**
 * Everything _except_ the target specification
 */
export type NavLinkParams = Anchor.AnchorParams;

/**
 * All the props (presentation and target)
 */
export type NavLinkProps = NavLinkParams & CoreLinkProps;

export const NavLink = inject('locationManager')(
    observer(
        class /**
         * A simple path-changing link component
         */
        NavLink extends React.Component<NavLinkProps & UsesLocation> {
            constructor(props: NavLinkProps) {
                super(props);
                this._handleClick = this._handleClick.bind(this);
            }

            /**
             * Calculate the location where this links should take us
             */
            _getWantedLocation(): MyLocation {
                const { position, to, argChanges, appendTokens, removeTokenCount, toRef } = this.props;
                return this.props.locationManager!.getNewLocationForLinkProps({
                    position,
                    to,
                    argChanges,
                    appendTokens,
                    removeTokenCount,
                    toRef,
                });
            }

            _handleClick() {
                this.props.locationManager!.trySetLocation(this._getWantedLocation());
            }

            render() {
                const { children, ...remnants } = this.props;
                const { target } = this.props;
                return (
                    <Anchor.Anchor
                        href={locationToUrl(this._getWantedLocation())}
                        onClick={target ? undefined : this._handleClick}
                        {...remnants}
                    >
                        {children}
                    </Anchor.Anchor>
                );
            }
        }
    )
);
