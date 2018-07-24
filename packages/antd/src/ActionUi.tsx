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
        const { operation, invisible, children, ...props } = parseProps(this.props);
        if (invisible || operation.invisible) {
            return null;
        }
        return (
            <Button
                id={this.props.id}
                onClick={operation.fire}
                {...props}
                size={this.props.size as ButtonSize}
                shape={this.props.shape as ButtonShape}
                type={this.props.type as ButtonType}
            >
                {children}
            </Button>
        );
    }
}
