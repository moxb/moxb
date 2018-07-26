import * as React from 'react';
import { observer } from 'mobx-react';
import { BindUiProps, parseProps } from './BindUi';
import { Action } from '@moxb/moxb';
import { Button } from 'antd';
import { ButtonProps, ButtonSize, ButtonType, ButtonShape } from 'antd/lib/button';

export type BindActionUiProps = BindUiProps<Action> & ButtonProps;

@observer
export class ActionButtonUi extends React.Component<BindActionUiProps> {
    render() {
        const { operation, invisible, children, label, id, size, shape, type, ...props } = parseProps(
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
            >
                {children != null ? children : label}
            </Button>
        );
    }
}
