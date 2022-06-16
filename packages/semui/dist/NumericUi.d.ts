import { Numeric } from '@moxb/moxb';
import * as React from 'react';
import { FormInputProps } from 'semantic-ui-react';
export interface BindNumericUiProps extends React.HTMLProps<HTMLFormElement> {
    operation: Numeric;
    help?: string;
    showErrors?: boolean;
}
export declare class NumericUi extends React.Component<FormInputProps & BindNumericUiProps> {
    render(): JSX.Element | null;
}
