import { Bool } from '@moxb/moxb';
import * as React from 'react';
import { DropdownProps, FormCheckboxProps } from 'semantic-ui-react';
import { BindUiProps } from './BindUi';
export declare class BoolUi extends React.Component<{
    operation: Bool;
} & FormCheckboxProps> {
    render(): JSX.Element | null;
}
export declare class BoolDropdownItemUi extends React.Component<BindUiProps<Bool> & DropdownProps> {
    render(): JSX.Element | null;
}
