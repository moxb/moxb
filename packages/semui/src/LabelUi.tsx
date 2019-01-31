import { Label } from '@moxb/moxb';
import * as marked from 'marked';
import { observer } from 'mobx-react';
import * as React from 'react';
import { parseProps, stripSurroundingP } from './BindUi';

export interface BindLabelAntProps extends React.HTMLProps<HTMLDivElement> {
    operation: Label;
}

@observer
export class LabelUi extends React.Component<BindLabelAntProps> {
    render() {
        const { operation, ...props } = parseProps(this.props);
        const escapedText = operation.showRawText ? operation.text! : operation.text!.replace(/<[^>]+>/g, '');
        return <div {...props}>{escapedText}</div>;
    }
}

@observer
export class LabelMarkdownUi extends React.Component<BindLabelAntProps> {
    render() {
        const { operation, ...props } = parseProps(this.props);
        const html = !operation.showRawText ? stripSurroundingP(marked(operation.text || '')) : operation.text!;
        return <div dangerouslySetInnerHTML={{ __html: html }} {...props} />;
    }
}
