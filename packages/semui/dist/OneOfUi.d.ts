import { OneOf } from '@moxb/moxb';
import * as React from 'react';
import { FormFieldProps, FormRadioProps } from 'semantic-ui-react';
import { BindUiProps } from './BindUi';
export declare class OneOfUi extends React.Component<BindUiProps<OneOf> & FormRadioProps> {
    render(): JSX.Element | null;
}
export declare class OneOfSelectUi extends React.Component<BindUiProps<OneOf> & FormFieldProps> {
    render(): JSX.Element | null;
}
