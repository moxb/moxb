import * as React from 'react';
import { observer } from 'mobx-react';
import { BindAntProps, parseProps } from './BindAnt';
import { Button } from 'antd';
import { ButtonSize, ButtonType, ButtonShape } from 'antd/lib/button';
import { NativeButtonProps } from 'antd/lib/button/button';
import { Action } from '@moxb/moxb';
import { FormItemAnt, BindFormItemAntProps, parsePropsForChild } from './FormItemAnt';

export type BindActionAntProps = BindAntProps<Action> & NativeButtonProps;

@observer
export class ActionButtonAnt extends React.Component<BindActionAntProps> {
    render() {
        const { operation, invisible, children, label, id, size, shape, htmlType, type, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible || operation.invisible) {
            return null;
        }
        return (
            <Button
                id={id}
                onClick={operation.fire}
                {...props}
                size={size as ButtonSize}
                shape={shape as ButtonShape}
                type={type as ButtonType}
                htmlType={typeof htmlType === 'undefined' ? 'button' : htmlType}
            >
                {children != null ? children : label}
            </Button>
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
