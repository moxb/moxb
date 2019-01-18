import { Action } from '@moxb/moxb';
import { Button, Spin } from 'antd';
import { ButtonShape, ButtonSize, ButtonType } from 'antd/lib/button';
import { NativeButtonProps } from 'antd/lib/button/button';
import { observer } from 'mobx-react';
import * as React from 'react';
import { BindAntProps, parseProps } from './BindAnt';
import { BindFormItemAntProps, FormItemAnt, parsePropsForChild } from './FormItemAnt';
import { MouseEvent } from 'react';

export type BindActionAntProps = BindAntProps<Action> & NativeButtonProps;

@observer
export class ActionButtonAnt extends React.Component<BindActionAntProps> {
    protected handleClick(event: MouseEvent<any>) {
        const { operation, stopPropagation } = parseProps(this.props, this.props.operation);

        console.log('event', event);

        if (stopPropagation) {
            event.stopPropagation();
        }

        if (operation.pending) {
            // console.log('Ignoring click on pending operation');
        } else {
            operation.fire();
        }
    }

    constructor(props: BindActionAntProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        const { operation, invisible, children, label, id, size, shape, htmlType, type, reason, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible || operation.invisible) {
            return null;
        }
        return (
            <Button
                id={id}
                onClick={this.handleClick}
                {...props}
                size={size as ButtonSize}
                shape={shape as ButtonShape}
                type={type as ButtonType}
                title={reason}
                htmlType={typeof htmlType === 'undefined' ? 'button' : htmlType}
            >
                {children != null ? children : label}
                {operation.pending && <Spin />}
            </Button>
        );
    }
}

@observer
export class ActionSpanAnt extends React.Component<BindActionAntProps> {
    protected handleClick(event: MouseEvent<any>) {
        const { operation, stopPropagation } = parseProps(this.props, this.props.operation);

        if (stopPropagation) {
            event.stopPropagation();
        }

        operation.fire();
    }

    constructor(props: BindActionAntProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        const { operation, invisible, children, label, id, reason, stopPropagation, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible || operation.invisible) {
            return null;
        }
        return (
            <span id={id} onClick={this.handleClick} title={reason} {...props as any}>
                {children != null ? children : label}
            </span>
        );
    }
}

@observer
export class ActionFormButtonAnt extends React.Component<BindActionAntProps & BindFormItemAntProps> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} label={null} {...this.props as any}>
                <ActionButtonAnt htmlType="submit" operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}
