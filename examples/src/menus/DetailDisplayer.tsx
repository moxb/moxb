import { getParsedPathTokens, UsesLocation } from '@moxb/moxb';
import { NavigableUIContent } from '@moxb/html';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { UsesURL } from '../store/UrlStore';

export const DetailDisplayer = inject('locationManager', 'url')(observer(
    class DetailDisplayer extends React.Component<NavigableUIContent & UsesLocation & UsesURL> {
        componentDidMount() {
            this.props.navControl.registerStateHooks({
                getLeaveQuestion: () => 'Do you really want to leave behind the details?',
            });
        }

        public render() {
            return (
                <div>
                    <div>
                        We are at <b>{getParsedPathTokens(this.props).join(' / ')}</b>
                    </div>
                    <div>
                        Displaying content for topic <b>{this.props.url!.something.value}</b>
                    </div>
                </div>
            );
        }
    }
));
