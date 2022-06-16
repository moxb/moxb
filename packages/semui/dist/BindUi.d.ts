import { Bind } from '@moxb/moxb';
import * as React from 'react';
export interface BindUiProps<T extends Bind> {
    operation: T;
    invisible?: boolean;
}
/**
 * This function essentially merges the BindUiProps with the data that comes form the operation.
 * The direct props override properties of the operation!
 */
export declare function parseProps<T>(bindProps: T): T;
export declare function labelWithHelp(label: any, help?: string): any;
/**
 * Remove a `<p>...</p>` that surrounds the html.
 * @param html
 */
export declare function stripSurroundingP(html: string): string;
export declare class BindMarkdownDiv extends React.Component<{
    markdownText: string;
} & React.HTMLProps<HTMLDivElement>> {
    render(): JSX.Element;
}
