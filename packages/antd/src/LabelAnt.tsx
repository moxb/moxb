import { Label } from '@moxb/moxb';
import * as marked from 'marked';
import { observer } from 'mobx-react';
import * as React from 'react';
import { parseProps } from './BindAnt';

export interface BindLabelAntProps extends React.HTMLProps<HTMLDivElement> {
    operation: Label;
}

export const LabelAnt = observer(class LabelAnt extends React.Component<BindLabelAntProps> {
    render() {
        const { operation, invisible, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        const escapedText = operation.showRawText ? operation.text! : operation.text!.replace(/<[^>]+>/g, '');
        return (
            <div data-testid={operation.id} {...props}>
                {escapedText}
            </div>
        );
    }
});

/**
 * Remove a `<p>...</p>` that surrounds the html.
 * @param html
 */
function stripSurroundingP(html: string) {
    return html.replace(/^\s*<p>/, '').replace(/<\/p>\s*$/, '');
}

export const LabelMarkdownAnt = observer(class LabelMarkdownAnt extends React.Component<BindLabelAntProps> {
    render() {
        const { operation, invisible, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        const html = !operation.showRawText ? stripSurroundingP(marked(operation.text || '')) : operation.text!;
        return <div data-testid={operation.id} dangerouslySetInnerHTML={{ __html: html }} {...props} />;
    }
});

/**
 * This is a basic React component which can convert a markdown text
 * to a <div></div> with parsed text as children elements.
 */
export class BindMarkdownDiv extends React.Component<{ text: string } & React.HTMLProps<HTMLDivElement>> {
    render() {
        const { text, ...props } = this.props;
        const html = stripSurroundingP(marked(text || ''));
        return <div dangerouslySetInnerHTML={{ __html: html }} {...props} />;
    }
}
