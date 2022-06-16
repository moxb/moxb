import { Action } from '@moxb/moxb';
import * as React from 'react';
import { DropdownProps, FormButtonProps } from 'semantic-ui-react';
import { BindUiProps } from './BindUi';
export declare type ActionUiProps = BindUiProps<Action> & FormButtonProps;
export declare class ActionFormButtonUi extends React.Component<ActionUiProps> {
    render(): JSX.Element | null;
}
export declare class ActionButtonUi extends React.Component<ActionUiProps> {
    render(): JSX.Element | null;
}
export declare class ActionDropdownItemUi extends React.Component<BindUiProps<Action> & DropdownProps> {
    render(): JSX.Element | null;
}
