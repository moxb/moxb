import { Tree } from '@moxb/moxb';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Tree as TreeComponent } from 'antd';
import { TreeProps } from 'antd/lib/tree';
import { BindAntProps, parseProps } from './BindAnt';
import { BindFormItemAntProps, FormItemAnt, parsePropsForChild } from './FormItemAnt';

@observer
export class TreeAnt extends React.Component<BindAntProps<Tree> & TreeProps> {
    render() {
        const { operation, invisible, children, ...props } = parseProps(this.props, this.props.operation);

        if (invisible) {
            return null;
        }

        const value = toJS(operation.value);
        return (
            <TreeComponent
                checkable={true}
                checkStrictly={operation.strictSelect || false}
                data-testid={operation.id}
                treeData={operation.nodes}
                defaultExpandedKeys={operation.expandValues ? value || [] : []}
                checkedKeys={value || []}
                onCheck={checkedKeys => {
                    operation.setValue(checkedKeys as string[]);
                }}
                {...props}
            >
                {children}
            </TreeComponent>
        );
    }
}

@observer
export class TreeFormAnt extends React.Component<BindAntProps<Tree> & TreeProps & BindFormItemAntProps> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }

        return (
            <FormItemAnt operation={operation} {...(this.props as any)}>
                <TreeAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}
