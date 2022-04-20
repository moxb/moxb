import { Action } from '@moxb/moxb';
import { observer } from 'mobx-react';
import * as React from 'react';
import { BindHtmlProps, parseHtmlProps } from './BindHtml';

export const ActionButtonHtml = observer(
    class ActionButtonHtml extends React.Component<BindHtmlProps<Action> & HTMLButtonElement> {
        render() {
            const { operation, invisible, children, label, id, ...props } = parseHtmlProps(
                this.props,
                this.props.operation
            );
            if (invisible || operation.invisible) {
                return null;
            }
            return (
                <button id={id} onClick={operation.fire} {...(props as any)}>
                    {children != null ? children : label}
                </button>
            );
        }
    }
);

export const ActionAnchorHtml = observer(
    class ActionAnchorHtml extends React.Component<BindHtmlProps<Action> & HTMLAnchorElement> {
        render() {
            const { operation, invisible, children, label, id, ...props } = parseHtmlProps(
                this.props,
                this.props.operation
            );
            if (invisible || operation.invisible) {
                return null;
            }
            return (
                <a id={id} onClick={operation.fire} {...(props as any)}>
                    {children != null ? children : label}
                </a>
            );
        }
    }
);
