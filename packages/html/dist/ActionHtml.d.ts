import { Action } from '@moxb/moxb';
import * as React from 'react';
import { BindHtmlProps } from './BindHtml';
export declare class ActionButtonHtml extends React.Component<BindHtmlProps<Action> & HTMLButtonElement> {
    render(): JSX.Element | null;
}
export declare class ActionAnchorHtml extends React.Component<BindHtmlProps<Action> & HTMLAnchorElement> {
    render(): JSX.Element | null;
}
