import { Bind } from '@moxb/moxb';
import * as marked from 'marked';
import * as React from 'react';

import { Icon, Popup } from 'semantic-ui-react';

export interface BindUiProps<T extends Bind> {
    operation: T;
    invisible?: boolean;
}

/**
 * This function essentially merges the BindUiProps with the data that comes form the operation.
 * The direct props override properties of the operation!
 */
export function parseProps<T>(bindProps: T): T {
    let { id, operation, invisible, label, disabled, readOnly, children, ...props } = bindProps as any;
    id = typeof id !== 'undefined' ? id : operation.domId;
    label = typeof label !== 'undefined' ? label : operation.label;
    disabled = typeof disabled !== 'undefined' ? disabled : operation.disabled;
    readOnly = typeof readOnly !== 'undefined' ? readOnly : operation.readOnly;
    invisible = typeof invisible !== 'undefined' ? invisible : operation.invisible;
    return {
        id,
        operation,
        label,
        disabled,
        readOnly,
        invisible,
        children,
        ...props,
    };
}

//trigger={<Button basic icon="help" circular size="mini" />}
// trigger={<sup><Icon name="help circle outline" /></sup>}
// trigger={<sup><Button style={{fontSize:"0.5rem"}} basic icon="help" circular compact size="mini" color='grey' /></sup>}

export function labelWithHelp(label: any, help?: string) {
    // help=`# This is help for *${label}*\n\nand the body\n\nwith **multiple** paragraphs.`;
    if (help && typeof label === 'string') {
        return (
            <label>
                {label}{' '}
                <Popup
                    trigger={<Icon name="question circle outline" />}
                    on={['hover', 'click' /*click requires the trigger to be an icon*/]}
                >
                    <div dangerouslySetInnerHTML={{ __html: marked(help) }} />
                </Popup>
            </label>
        );
    } else {
        return label;
    }
}

/**
 * Remove a `<p>...</p>` that surrounds the html.
 * @param html
 */
export function stripSurroundingP(html: string) {
    return html.replace(/^\s*<p>/, '').replace(/<\/p>\s*$/, '');
}

export const BindMarkdownDiv = (props: { markdownText: string } & React.HTMLProps<HTMLDivElement>) => {
    const { markdownText, ...rest } = props;
    const html = stripSurroundingP(marked(markdownText));
    return <div dangerouslySetInnerHTML={{ __html: html }} {...rest} />;
};
