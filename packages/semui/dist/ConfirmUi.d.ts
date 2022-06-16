import { Confirm as MoxbConfirm } from '@moxb/moxb';
import * as React from 'react';
import { ConfirmProps } from 'semantic-ui-react';
export interface BindConfirmUiProps extends ConfirmProps {
    confirm: MoxbConfirm<any>;
}
export declare class ConfirmUi extends React.Component<BindConfirmUiProps> {
    render(): JSX.Element;
}
