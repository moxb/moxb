import { Label } from '@moxb/moxb';
import * as marked from 'marked';
import { observer } from 'mobx-react';
import * as React from 'react';
import { parseProps } from './BindAnt';

export interface BindLabelAntProps extends React.HTMLProps<HTMLDivElement> {
    operation: Label;
}

@observer
export class LabelAnt extends React.Component<BindLabelAntProps> {
    render() {
        const { operation, invisible, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        const escapedText = operation.showRawText ? operation.text! : operation.text!.replace(/<[^>]+>/g, '');
        return <div {...props}>{escapedText}</div>;
    }
}

@observer
export class LabelMarkdownAnt extends React.Component<BindLabelAntProps> {
    render() {
        const { operation, invisible, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        const html = !operation.showRawText
            ? marked(operation.text!)
                  .replace(/^<p>/, '')
                  .replace(/<\/p>$/, '')
            : operation.text!;
        return <div dangerouslySetInnerHTML={{ __html: html }} {...props} />;
    }
}

/**
 * This is a basic React component which can convert a markdown text
 * to a <div></div> with parsed text as children elements.
 */
export class BindMarkdownDiv extends React.Component<{ text: string } & React.HTMLProps<HTMLDivElement>> {
    render() {
        const { text, ...props } = this.props;
        const html = marked(text ? text : '')
            .replace(/^<p>/, '')
            .replace(/<\/p>$/, '');
        return <div dangerouslySetInnerHTML={{ __html: html }} {...props} />;
    }
}
