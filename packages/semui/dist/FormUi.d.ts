import { Form as MoxForm } from '@moxb/moxb';
import * as React from 'react';
import { FormProps } from 'semantic-ui-react';
export interface BindFormUiProps extends React.HTMLProps<HTMLFormElement> {
    operation: MoxForm;
    hideErrors?: boolean;
}
export declare class FormUi extends React.Component<FormProps & BindFormUiProps> {
    render(): JSX.Element | null;
}
