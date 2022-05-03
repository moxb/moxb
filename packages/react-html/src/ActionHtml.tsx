import { Action } from '@moxb/moxb';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { BindHtmlProps, parseHtmlProps } from './BindHtml';

export const ActionButtonHtml = observer((props: BindHtmlProps<Action> & HTMLButtonElement) => {
    const { operation, invisible, children, label, id, ...rest } = parseHtmlProps(props, props.operation);
    if (invisible || operation.invisible) {
        return null;
    }
    return (
        <button id={id} onClick={operation.fire} {...(rest as any)}>
            {children != null ? children : label}
        </button>
    );
});

export const ActionAnchorHtml = observer((props: BindHtmlProps<Action> & HTMLAnchorElement) => {
    const { operation, invisible, children, label, id, ...rest } = parseHtmlProps(props, props.operation);
    if (invisible || operation.invisible) {
        return null;
    }
    return (
        <a id={id} onClick={operation.fire} {...(rest as any)}>
            {children != null ? children : label}
        </a>
    );
});
