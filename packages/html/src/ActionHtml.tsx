import * as React from 'react';
import { observer } from 'mobx-react';
import { BindAntProps, parseProps } from './BindHtml';
import { Action } from '@moxb/moxb';

@observer
export class ActionButtonHtml extends React.Component<BindAntProps<Action> & HTMLButtonElement> {
    render() {
        const { operation, invisible, children, label, id, ...props } = parseProps(this.props, this.props.operation);
        if (invisible || operation.invisible) {
            return null;
        }
        return (
            <button id={id} onClick={operation.fire} {...props as any}>
                {children != null ? children : label}
            </button>
        );
    }
}

@observer
export class ActionAnchorHtml extends React.Component<BindAntProps<Action> & HTMLAnchorElement> {
    render() {
        const { operation, invisible, children, label, id, ...props } = parseProps(this.props, this.props.operation);
        if (invisible || operation.invisible) {
            return null;
        }
        return (
            <a id={id} onClick={operation.fire} {...props as any}>
                {children != null ? children : label}
            </a>
        );
    }
}
