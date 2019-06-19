import { idToDomId, ManyOf } from '@moxb/moxb';
import { Checkbox, Col, Row, Select } from 'antd';
import { CheckboxGroupProps } from 'antd/lib/checkbox';
import { SelectProps } from 'antd/lib/select';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { BindAntProps, parseProps } from './BindAnt';
import { BindFormItemAntProps, FormItemAnt, parsePropsForChild } from './FormItemAnt';

@observer
export class ManyOfAnt extends React.Component<BindAntProps<ManyOf> & SelectProps> {
    render() {
        const { operation, invisible, mode, children, defaultValue, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible) {
            return null;
        }
        // make sure the value is not a mobx object...
        const value = toJS(operation.value);
        return (
            <Select
                data-testid={operation.id}
                onChange={(selectionValue: any) => operation.setValue(selectionValue)}
                value={value || undefined}
                placeholder={operation.placeholder}
                defaultValue={defaultValue}
                mode={typeof mode === 'undefined' ? 'default' : mode}
                {...props}
            >
                {operation.choices.map((opt: any) => (
                    <Select.Option
                        data-testid={idToDomId(operation.id + '.' + opt.value)}
                        key={opt.value}
                        value={opt.value}
                    >
                        {opt.label}
                    </Select.Option>
                ))}
                {children}
            </Select>
        );
    }
}

@observer
export class ManyOfCheckboxAnt extends React.Component<BindAntProps<ManyOf> & CheckboxGroupProps> {
    render() {
        const { operation, invisible, children, defaultValue, ...props } = parseProps(this.props, this.props.operation);
        if (invisible || operation.invisible) {
            return null;
        }
        // make sure the value is not a mobx object...
        const value = toJS(operation.value);
        return (
            <Checkbox.Group
                data-testid={operation.id}
                onChange={(selectionValue: any) => operation.setValue(selectionValue)}
                value={value}
                defaultValue={defaultValue}
                {...props}
            >
                <Row>
                    {operation.choices.map((opt: any) => (
                        <Col key={opt.value}>
                            <Checkbox data-testid={idToDomId(operation.id + '.' + opt.value)} value={opt.value}>
                                {opt.label}
                            </Checkbox>
                        </Col>
                    ))}
                    {children}
                </Row>
            </Checkbox.Group>
        );
    }
}

@observer
export class ManyOfFormAnt extends React.Component<SelectProps & BindAntProps<ManyOf> & BindFormItemAntProps> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...this.props as any}>
                <ManyOfAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}
