import { BindOneOfChoice, idToDomId, OneOf } from '@moxb/moxb';
import { Button, Dropdown, Menu, Radio, Select } from 'antd';
import { DropDownProps } from 'antd/lib/dropdown';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { RadioGroupProps, RadioProps } from 'antd/lib/radio';
import DownOutlined from '@ant-design/icons/DownOutlined';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { BindAntProps, labelWithHelpIndicator, parseProps } from './BindAnt';
import { BindFormItemAntProps, FormItemAnt, parsePropsForChild } from './FormItemAnt';
import { SelectProps } from 'antd/lib/select';
import { MenuInfo } from 'rc-menu/lib/interface';

export interface OneOfAntProps {
    /**
     * Should we align the items vertically, instead of horizontally?
     */
    vertical?: boolean;

    /**
     * We should insert a line break after every this many buttons
     *
     * Ie. specify "2" to add a line break after every second button.
     *
     * Don't use this together with vertical.
     */
    breakAfter?: number;
}

@observer
export class OneOfAnt extends React.Component<BindAntProps<OneOf> & RadioProps & RadioGroupProps & OneOfAntProps> {
    render() {
        const { operation, invisible, vertical, breakAfter, reason, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible) {
            return null;
        }
        const radioStyle: React.CSSProperties = {};
        if (vertical) {
            radioStyle.display = 'block';
        }
        const elements: JSX.Element[] = [];
        operation.choices.forEach((opt, index) => {
            elements.push(
                <span key={opt.value} title={reason || opt.reason || opt.help}>
                    <Radio
                        data-testid={idToDomId(operation.id + '.' + opt.value)}
                        key={opt.value}
                        value={opt.value}
                        style={radioStyle}
                        disabled={opt.disabled}
                    >
                        {opt.widget ? opt.widget : labelWithHelpIndicator(opt.label, opt.help)}
                    </Radio>
                </span>
            );
            if (!!breakAfter && !((index + 1) % breakAfter)) {
                elements.push(<br key={'after-' + index} />);
            }
        });
        return (
            <Radio.Group
                data-testid={idToDomId(operation.id)}
                onChange={(e) => operation.setValue(e.target.value)}
                {...props}
                value={operation.value}
            >
                {elements}
            </Radio.Group>
        );
    }
}

@observer
export class OneOfFormAnt extends React.Component<
    BindAntProps<OneOf> & RadioProps & Partial<FormItemProps> & OneOfAntProps
> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(this.props as any)}>
                <OneOfAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}

export interface OneOfButtonAntProps {
    /**
     * We should insert a line break after every this many buttons
     *
     * Ie. specify "2" to add a line break after every second button.
     */
    breakAfter?: number;
}

@observer
export class OneOfButtonAnt extends React.Component<
    BindAntProps<OneOf> & RadioProps & RadioGroupProps & OneOfButtonAntProps
> {
    render() {
        const { operation, invisible, readOnly, breakAfter, reason, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible) {
            return null;
        }
        if (readOnly) {
            return <span>{operation.choice}</span>;
        }
        const elements: JSX.Element[] = [];
        operation.choices.forEach((opt, index) => {
            elements.push(
                <span key={opt.value} title={reason || opt.reason || opt.help}>
                    <Radio.Button
                        data-testid={idToDomId(operation.id + '.' + opt.value)}
                        key={opt.value}
                        value={opt.value}
                        disabled={opt.disabled}
                    >
                        {opt.widget ? opt.widget : labelWithHelpIndicator(opt.label, opt.help)}
                    </Radio.Button>
                </span>
            );
            if (!!breakAfter && !((index + 1) % breakAfter)) {
                elements.push(<br key={'after-' + index} />);
            }
        });

        return (
            <Radio.Group
                data-testid={operation.id}
                onChange={(e) => operation.setValue(e.target.value)}
                {...props}
                value={operation.value}
            >
                {elements}
            </Radio.Group>
        );
    }
}

@observer
export class OneOfButtonFormAnt extends React.Component<
    BindAntProps<OneOf> & RadioProps & RadioGroupProps & Partial<FormItemProps> & OneOfButtonAntProps
> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(this.props as any)}>
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
    onSelect(params: MenuInfo) {
        const { operation } = this.props;

        const index = parseInt(params.key);
        operation.setValue(operation.choices[index].value);
    }

    getChoiceLabel(): React.ReactNode | undefined {
        const { operation } = this.props;
        if (!operation.choice) {
            return <span style={{ color: '#aaaaaa' }}>{operation.placeholder}</span>;
        }

        for (const choice of operation.choices) {
            if (choice.value === operation.choice) {
                return <span>{choice.label}</span>;
            }
        }

        return <span>{operation.choice}</span>;
    }

    render() {
        const { operation, invisible, readOnly, id, ...props } = parseProps(this.props, this.props.operation);
        const trigger = props.trigger || ['click'];
        delete props.trigger;
        if (invisible) {
            return null;
        }

        if (readOnly) {
            return this.getChoiceLabel();
        }

        const overlay = (
            <Menu data-testid={operation.id + '-menu'}>
                {operation.choices.map((choice, index) => (
                    <Menu.Item
                        data-testid={idToDomId(operation.id + '.menu.' + choice.value)}
                        key={index}
                        onClick={this.onSelect}
                    >
                        {choice.widget || choice.label}
                    </Menu.Item>
                ))}
            </Menu>
        );

        // antd DropDown does not set the ID on the created html element, set it manually to the button to fix all the tests
        return (
            <Dropdown data-testid={id} overlay={overlay} trigger={trigger} {...props}>
                <Button
                    id={id}
                    style={{
                        display: 'inline-flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    {this.getChoiceLabel()} <DownOutlined />
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
        const { operation, invisible, id, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(this.props as any)}>
                <OneOfDropDownAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}

@observer
export class OneOfSelectAnt extends React.Component<BindAntProps<OneOf> & SelectProps<any>> {
    render() {
        const { operation, invisible, readOnly, mode, reason, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        if (readOnly) {
            return <span data-testid={operation.id}>{operation.choice}</span>;
        }

        return (
            <span title={reason}>
                <Select
                    data-testid={operation.id}
                    onChange={(selectionValue: any) => operation.setValue(selectionValue)}
                    value={operation.value || undefined}
                    placeholder={operation.placeholder}
                    mode={mode}
                    {...props}
                >
                    {operation.choices.map((opt) => (
                        <Select.Option
                            data-testid={idToDomId(operation.id + '.' + opt.value)}
                            key={opt.value}
                            value={opt.value}
                            disabled={opt.disabled}
                            title={opt.reason || opt.help}
                        >
                            {opt.widget ? opt.widget : labelWithHelpIndicator(opt.label, opt.help)}
                        </Select.Option>
                    ))}
                </Select>
            </span>
        );
    }
}

interface OneOfSearchableSelectAntState<T = string> {
    value?: string;
    data: BindOneOfChoice<T>[];
}

@observer
export class OneOfSearchableSelectAnt extends React.Component<
    BindAntProps<OneOf> & SelectProps<any>,
    OneOfSearchableSelectAntState<any>
> {
    render() {
        const { operation, invisible, readOnly, mode, reason, ...props } = parseProps(this.props, this.props.operation);

        if (invisible) {
            return null;
        }
        if (readOnly) {
            return <span data-testid={operation.id}>{operation.choice}</span>;
        }
        return (
            <span title={reason}>
                <Select
                    showSearch
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    data-testid={operation.id}
                    onChange={(selectionValue: any) => {
                        operation.setValue(selectionValue);
                        operation.searchData('');
                    }}
                    onSearch={operation.searchData}
                    notFoundContent={null}
                    filterOption={false}
                    // mode={mode}
                    value={operation.value || undefined}
                    placeholder={operation.placeholder}
                    {...props}
                >
                    {operation.filteredChoices.map((opt: BindOneOfChoice<any>) => (
                        <Select.Option
                            data-testid={idToDomId(operation.id + '.' + opt.value)}
                            key={opt.value}
                            value={opt.value}
                            disabled={opt.disabled}
                            title={opt.reason || opt.help}
                        >
                            {opt.widget ? opt.widget : labelWithHelpIndicator(opt.label, opt.help)}
                        </Select.Option>
                    ))}
                </Select>
            </span>
        );
    }
}

@observer
export class OneOfSelectFormAnt extends React.Component<BindAntProps<OneOf> & BindFormItemAntProps & SelectProps<any>> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(this.props as any)}>
                <OneOfSelectAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}

@observer
export class OneOfSearchableSelectFormAnt extends React.Component<
    BindAntProps<OneOf> & BindFormItemAntProps & SelectProps<any>
> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(this.props as any)}>
                <OneOfSearchableSelectAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}
