import { Tree } from '@moxb/moxb';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Tree as TreeComponent } from 'antd';
import { TreeProps } from 'antd/lib/tree';
import { BindAntProps, parseProps } from './BindAnt';
import { BindFormItemAntProps, FormItemAnt, parsePropsForChild } from './FormItemAnt';

export const TreeAnt = observer((props: BindAntProps<Tree> & TreeProps) => {
    const { operation, invisible, children, reason, ...rest } = parseProps(props, props.operation);

    if (invisible) {
        return null;
    }

    const value = toJS(operation.value);
    return (
        <span title={reason}>
            <TreeComponent
                checkable={true}
                checkStrictly={operation.strictSelect || false}
                data-testid={operation.id}
                treeData={operation.nodes}
                defaultExpandedKeys={operation.expandValues ? value || [] : []}
                checkedKeys={value || []}
                onCheck={(checkedKeys) => {
                    operation.setValue(checkedKeys as string[]);
                }}
                {...rest}
            >
                {children}
            </TreeComponent>
        </span>
    );
});

export const TreeFormAnt = observer((props: BindAntProps<Tree> & TreeProps & BindFormItemAntProps) => {
    const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
    if (invisible) {
        return null;
    }

    return (
        <FormItemAnt operation={operation} {...(props as any)}>
            <TreeAnt operation={operation} {...rest} />
        </FormItemAnt>
    );
});
