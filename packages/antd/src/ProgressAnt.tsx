import * as React from 'react';
import { observer } from 'mobx-react';
import { Progress as PAnt } from 'antd';
import { Progress } from '@moxb/moxb';
import { BindAntProps, parseProps } from './BindAnt';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { FormItemAnt, parsePropsForChild } from './FormItemAnt';

@observer
export class ProgressAnt extends React.Component<BindAntProps<Progress>> {
    render() {
        const { operation, invisible, children, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }

        return (
            <PAnt
                data-testid={operation.id}
                percent={operation.value}
                status={operation.status}
                type={operation.type}
                steps={operation.steps}
                {...props}
            >
                {children}
            </PAnt>
        );
    }
}

@observer
export class ProgressFormAnt extends React.Component<BindAntProps<Progress> & Partial<FormItemProps>> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }

        return (
            <FormItemAnt operation={operation} {...(this.props as any)}>
                <ProgressAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}
