import { Label } from '@moxb/moxb';
import * as React from 'react';
export interface BindLabelAntProps extends React.HTMLProps<HTMLDivElement> {
    operation: Label;
}
export declare class LabelUi extends React.Component<BindLabelAntProps> {
    render(): JSX.Element;
}
export declare class LabelMarkdownUi extends React.Component<BindLabelAntProps> {
    render(): JSX.Element;
}
