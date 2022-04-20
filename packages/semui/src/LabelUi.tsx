import { Label } from '@moxb/moxb';
import * as marked from 'marked';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { parseProps, stripSurroundingP } from './BindUi';

export interface BindLabelAntProps extends React.HTMLProps<HTMLDivElement> {
    operation: Label;
}

export const LabelUi = observer((props: BindLabelAntProps) => {
    const { operation, ...rest } = parseProps(props);
    const escapedText = operation.showRawText ? operation.text! : operation.text!.replace(/<[^>]+>/g, '');
    return <div {...rest}>{escapedText}</div>;
});

export const LabelMarkdownUi = observer((props: BindLabelAntProps) => {
    const { operation, ...rest } = parseProps(props);
    const html = !operation.showRawText ? stripSurroundingP(marked(operation.text || '')) : operation.text!;
    return <div dangerouslySetInnerHTML={{ __html: html }} {...rest} />;
});
