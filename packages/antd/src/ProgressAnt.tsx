import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Progress as PAnt } from 'antd';
import { Progress } from '@moxb/moxb';
import { BindAntProps, parseProps } from './BindAnt';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { FormItemAnt, parsePropsForChild } from './FormItemAnt';

export const ProgressAnt = observer((props: BindAntProps<Progress>) => {
    const { operation, invisible, children, ...rest } = parseProps(props, props.operation);
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
            {...rest}
        >
            {children}
        </PAnt>
    );
});

export const ProgressFormAnt = observer((props: BindAntProps<Progress> & Partial<FormItemProps>) => {
    const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
    if (invisible) {
        return null;
    }

    return (
        <FormItemAnt operation={operation} {...(props as any)}>
            <ProgressAnt operation={operation} {...rest} />
        </FormItemAnt>
    );
});
