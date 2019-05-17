import { OneOf } from '@moxb/moxb';
import { Radio, Select, Dropdown, Menu, Button, Icon } from 'antd';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { RadioGroupProps, RadioProps } from 'antd/lib/radio';
import { SelectProps } from 'antd/lib/select';
import { observer } from 'mobx-react';
import * as React from 'react';
import { BindAntProps, parseProps } from './BindAnt';
import { BindFormItemAntProps, FormItemAnt, parsePropsForChild } from './FormItemAnt';
import { DropDownProps } from 'antd/lib/dropdown';
import { action } from 'mobx';
import { ClickParam } from 'antd/lib/menu';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

@observer
export class OneOfAnt extends React.Component<BindAntProps<OneOf> & RadioProps & RadioGroupProps> {
    render() {
        const { operation, invisible, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <Radio.Group onChange={e => operation.setValue(e.target.value)} {...props} value={operation.value}>
                {operation.choices.map(opt => (
                    <Radio key={opt.value} value={opt.value}>
                        {opt.widget ? opt.widget : opt.label}
                    </Radio>
                ))}
            </Radio.Group>
        );
    }
}

@observer
export class OneOfFormAnt extends React.Component<BindAntProps<OneOf> & RadioProps & FormItemProps> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...this.props as any}>
                <OneOfAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}

@observer
export class OneOfButtonAnt extends React.Component<BindAntProps<OneOf> & RadioProps & RadioGroupProps> {
    render() {
        const { operation, invisible, readOnly, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        if (readOnly) {
            return <span>{operation.choice}</span>;
        }
        return (
            <Radio.Group onChange={e => operation.setValue(e.target.value)} {...props} value={operation.value}>
                {operation.choices.map(opt => (
                    <Radio.Button key={opt.value} value={opt.value}>
                        {opt.widget ? opt.widget : opt.label}
                    </Radio.Button>
                ))}
            </Radio.Group>
        );
    }
}

@observer
export class OneOfButtonFormAnt extends React.Component<
    BindAntProps<OneOf> & RadioProps & RadioGroupProps & FormItemProps
> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...this.props as any}>
                <OneOfButtonAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}

@observer
export class OneOfDropDownAnt extends React.Component<
    BindAntProps<OneOf> & Omit<DropDownProps, 'overlay'> & { style?: React.CSSProperties }
> {
    @action.bound
    onSelect(params: ClickParam) {
        const { operation } = this.props;

        const index = parseInt(params.key);
        operation.setValue(operation.choices[index].value);
    }

    getChoiceLabel(): string | undefined {
        const { operation } = this.props;
        if (!operation.choice) {
            return operation.placeholder;
        }

        for (const choice of operation.choices) {
            if (choice.value === operation.choice) {
                return choice.label;
            }
        }

        return operation.choice;
    }

    render() {
        const { operation, invisible, readOnly, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }

        if (readOnly) {
            return <span>{this.getChoiceLabel()}</span>;
        }

        const overlay = (
            <Menu>
                {operation.choices.map((choice, index) => (
                    <Menu.Item key={index} onClick={this.onSelect}>
                        {choice.widget || choice.label}
                    </Menu.Item>
                ))}
            </Menu>
        );

        return (
            <Dropdown overlay={overlay} {...props}>
                <Button>
                    {this.getChoiceLabel()} <Icon type="down" />
                </Button>
            </Dropdown>
        );
    }
}

@observer
export class OneOfDropDownFormAnt extends React.Component<
    BindAntProps<OneOf> & BindFormItemAntProps & Omit<DropDownProps, 'overlay'>
> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...this.props as any}>
                <OneOfDropDownAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}

@observer
export class OneOfSelectAnt extends React.Component<BindAntProps<OneOf> & SelectProps> {
    render() {
        const { operation, invisible, readOnly, mode, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        if (readOnly) {
            return <span>{operation.choice}</span>;
        }

        return (
            <Select
                onChange={(selectionValue: any) => operation.setValue(selectionValue)}
                value={operation.value || undefined}
                placeholder={operation.placeholder}
                mode={mode || 'default'}
                {...props}
            >
                {operation.choices.map(opt => (
                    <Select.Option key={opt.value} value={opt.value}>
                        {opt.widget ? opt.widget : opt.label}
                    </Select.Option>
                ))}
            </Select>
        );
    }
}

@observer
export class OneOfSelectFormAnt extends React.Component<BindAntProps<OneOf> & BindFormItemAntProps & SelectProps> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...this.props as any}>
                <OneOfSelectAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}
