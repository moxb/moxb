import { Action, Bool } from '@moxb/moxb';
import { Button, Spin } from 'antd';
import { ButtonShape, ButtonType } from 'antd/lib/button';
import { NativeButtonProps } from 'antd/lib/button/button';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { MouseEvent } from 'react';
import { BindAntProps, parseProps } from './BindAnt';
import { BindFormItemAntProps, FormItemAnt, parsePropsForChild } from './FormItemAnt';

export interface ActionAntProps {
    stopPropagation?: boolean;
}

export type BindActionAntProps = BindAntProps<Action> & ActionAntProps & NativeButtonProps;

export const ActionButtonAnt = observer((props: BindActionAntProps) => {
    const { operation, invisible, children, label, id, size, shape, htmlType, type, reason, ...rest } = parseProps(
        props,
        props.operation
    );

    function handleClick(event: MouseEvent<any>) {
        const { stopPropagation } = parseProps(props, props.operation);

        if (stopPropagation) {
            event.stopPropagation();
        }

        if (operation.pending) {
            // console.log('Ignoring click on pending operation');
        } else {
            operation.fire();
        }
    }

    if (invisible || operation.invisible) {
        return null;
    }
    return (
        <Button
            id={id}
            data-testid={id}
            onClick={handleClick}
            {...rest}
            size={size}
            shape={shape as ButtonShape}
            type={type as ButtonType}
            title={reason}
            htmlType={typeof htmlType === 'undefined' ? 'button' : htmlType}
        >
            {children != null ? children : label}
            {operation.pending && <Spin />}
        </Button>
    );
});

export const ActionSpanAnt = observer((props: BindActionAntProps) => {
    const { operation, invisible, children, label, id, reason, stopPropagation, ...rest } = parseProps(
        props,
        props.operation
    );

    function handleClick(event: MouseEvent<any>) {
        if (stopPropagation) {
            event.stopPropagation();
        }

        operation.fire();
    }

    if (invisible || operation.invisible) {
        return null;
    }
    return (
        <span id={id} data-testid={id} onClick={handleClick} title={reason} {...(rest as any)}>
            {children != null ? children : label}
        </span>
    );
});

export const ActionToggleButtonAnt = observer(
    (
        props: {
            backgroundColor: string;
            labelColor: string;
            children?: React.ReactNode;
        } & BindAntProps<Bool>
    ) => {
        const { operation, invisible, children, label, id, reason, backgroundColor, labelColor, ...rest } = parseProps(
            props,
            props.operation
        );
        if (invisible || operation.invisible) {
            return null;
        }
        const style: React.CSSProperties = {
            backgroundColor: operation.value ? labelColor : backgroundColor,
            color: operation.value ? backgroundColor : undefined,
            boxShadow: operation.value ? 'rgba(51, 51, 51, 0.85) 0px 0px 5px inset' : undefined,
        };
        return (
            <Button
                id={id}
                data-testid={id}
                onClick={() => operation.toggle()}
                style={operation.disabled ? undefined : style}
                title={reason}
                {...(rest as any)}
            >
                {children != null ? children : label}
            </Button>
        );
    }
);

export const ActionFormButtonAnt = observer((props: BindActionAntProps & BindFormItemAntProps) => {
    const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
    if (invisible) {
        return null;
    }
    return (
        <FormItemAnt operation={operation} label={null} {...(props as any)}>
            <ActionButtonAnt htmlType="submit" operation={operation} {...rest} />
        </FormItemAnt>
    );
});
