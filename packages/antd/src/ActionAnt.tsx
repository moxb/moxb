import { Action, Bool } from '@moxb/moxb';
import { Button, Popconfirm, Spin } from 'antd';
import { ButtonShape, ButtonType } from 'antd/lib/button';
import { NativeButtonProps } from 'antd/lib/button/button';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useState } from 'react';
import { BindAntProps, parseProps } from './BindAnt';
import { BindFormItemAntProps, FormItemAnt, parsePropsForChild } from './FormItemAnt';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ActionAntProps {}

export type BindActionAntProps = BindAntProps<Action> & ActionAntProps & NativeButtonProps;

export const ActionButtonAnt = observer((props: BindActionAntProps) => {
    const {
        operation,
        invisible,
        children,
        label,
        id,
        size,
        shape,
        htmlType,
        type,
        reason,
        help,
        ...rest
    } = parseProps(props, props.operation);
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const needsConfirmation = !!operation.confirmQuestion;

    const handleConfirmationOpenChange = (newVisible: boolean) => {
        if (!newVisible) {
            setConfirmationVisible(newVisible);
            return;
        }
        if (operation.pending || operation.disabled) {
            // ignore click on already pending or disabled action
            return;
        }
        if (needsConfirmation) {
            setConfirmationVisible(true);
        } else {
            handleClick();
        }
    };

    function handleClick() {
        operation.fire();
    }

    if (invisible || operation.invisible) {
        return null;
    }

    return (
        <span title={reason || help}>
            <Popconfirm
                open={confirmationVisible}
                onOpenChange={handleConfirmationOpenChange}
                title={operation.confirmQuestion}
                onConfirm={handleClick}
            >
                <Button
                    id={id}
                    data-testid={id}
                    {...rest}
                    size={size}
                    shape={shape as ButtonShape}
                    type={type as ButtonType}
                    htmlType={typeof htmlType === 'undefined' ? 'button' : htmlType}
                >
                    {children != null ? children : label}
                    {operation.pending && <Spin />}
                </Button>
            </Popconfirm>
        </span>
    );
});

export const ActionSpanAnt = observer((props: BindActionAntProps) => {
    const { operation, invisible, children, label, id, reason, ...rest } = parseProps(props, props.operation);

    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const needsConfirmation = !!operation.confirmQuestion;

    const handleConfirmationOpenChange = (newVisible: boolean) => {
        if (!newVisible) {
            setConfirmationVisible(newVisible);
            return;
        }
        if (operation.pending) {
            // ignore click on already pending action
            return;
        }
        if (needsConfirmation) {
            setConfirmationVisible(true);
        } else {
            handleClick();
        }
    };

    function handleClick() {
        operation.fire();
    }

    if (invisible || operation.invisible) {
        return null;
    }
    return (
        <Popconfirm
            open={confirmationVisible}
            onOpenChange={handleConfirmationOpenChange}
            title={operation.confirmQuestion}
            onConfirm={handleClick}
        >
            <span id={id} data-testid={id} title={reason} {...rest}>
                {children != null ? children : label}
            </span>
        </Popconfirm>
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
        const {
            operation,
            invisible,
            children,
            label,
            id,
            reason,
            backgroundColor,
            labelColor,
            value,
            ...rest
        } = parseProps(props, props.operation);
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
                {...rest}
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
        <FormItemAnt label={undefined} {...props}>
            <ActionButtonAnt htmlType="submit" operation={operation} {...rest} />
        </FormItemAnt>
    );
});
