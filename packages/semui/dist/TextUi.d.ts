import { Text } from '@moxb/moxb';
import * as React from 'react';
import { FormInputProps } from 'semantic-ui-react';
export interface BindStringUiProps extends React.HTMLProps<HTMLFormElement> {
    operation: Text;
    useDoubleClickToEdit?: boolean;
    help?: string;
    showErrors?: boolean;
}
export declare class TextUi extends React.Component<FormInputProps & BindStringUiProps> {
    render(): JSX.Element | null;
}
