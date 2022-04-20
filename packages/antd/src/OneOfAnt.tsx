import { BindOneOfChoice, idToDomId, OneOf } from '@moxb/moxb';
import { Button, Dropdown, Menu, Radio, Select } from 'antd';
import { DropDownProps } from 'antd/lib/dropdown';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { RadioGroupProps, RadioProps } from 'antd/lib/radio';
import DownOutlined from '@ant-design/icons/DownOutlined';
import { observer } from 'mobx-react-lite';
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
     * I.e. specify "2" to add a line break after every second button.
     *
     * Don't use this together with vertical.
     */
    breakAfter?: number;
}

export const OneOfAnt = observer((props: BindAntProps<OneOf> & RadioProps & RadioGroupProps & OneOfAntProps) => {
    const { operation, invisible, vertical, breakAfter, reason, ...rest } = parseProps(props, props.operation);
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
            {...rest}
            value={operation.value}
        >
            {elements}
        </Radio.Group>
    );
});

export const OneOfFormAnt = observer(
    (props: BindAntProps<OneOf> & RadioProps & Partial<FormItemProps> & OneOfAntProps) => {
        const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(props as any)}>
                <OneOfAnt operation={operation} {...rest} />
            </FormItemAnt>
        );
    }
);

export interface OneOfButtonAntProps {
    /**
     * We should insert a line break after every this many buttons
     *
     * I.e. specify "2" to add a line break after every second button.
     */
    breakAfter?: number;
}

export const OneOfButtonAnt = observer(
    (props: BindAntProps<OneOf> & RadioProps & RadioGroupProps & OneOfButtonAntProps) => {
        const { operation, invisible, readOnly, breakAfter, reason, ...rest } = parseProps(props, props.operation);
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
                {...rest}
                value={operation.value}
            >
                {elements}
            </Radio.Group>
        );
    }
);

export const OneOfButtonFormAnt = observer(
    (props: BindAntProps<OneOf> & RadioProps & RadioGroupProps & Partial<FormItemProps> & OneOfButtonAntProps) => {
        const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(props as any)}>
                <OneOfButtonAnt operation={operation} {...rest} />
            </FormItemAnt>
        );
    }
);

type OneOfDropDownAntProps = BindAntProps<OneOf> & Omit<DropDownProps, 'overlay'> & { style?: React.CSSProperties };

export const OneOfDropDownAnt = observer((props: OneOfDropDownAntProps) => {
    function onSelect(params: MenuInfo) {
        const index = parseInt(params.key);
        operation.setValue(operation.choices[index].value);
    }

    function getChoiceLabel() {
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

    const { operation, invisible, readOnly, id, ...rest } = parseProps(props, props.operation);
    const trigger = rest.trigger || ['click'];
    delete rest.trigger;
    if (invisible) {
        return null;
    }

    if (readOnly) {
        return getChoiceLabel();
    }

    const overlay = (
        <Menu data-testid={operation.id + '-menu'}>
            {operation.choices.map((choice, index) => (
                <Menu.Item
                    data-testid={idToDomId(operation.id + '.menu.' + choice.value)}
                    key={index}
                    onClick={onSelect}
                >
                    {choice.widget || choice.label}
                </Menu.Item>
            ))}
        </Menu>
    );

    // antd DropDown does not set the ID on the created html element, set it manually to the button to fix all the tests
    return (
        <Dropdown data-testid={id} overlay={overlay} trigger={trigger} {...rest}>
            <Button
                id={id}
                style={{
                    display: 'inline-flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                {getChoiceLabel()} <DownOutlined />
            </Button>
        </Dropdown>
    );
});

export const OneOfDropDownFormAnt = observer(
    (props: BindAntProps<OneOf> & BindFormItemAntProps & Omit<DropDownProps, 'overlay'>) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { operation, invisible, id: _id, ...rest } = parsePropsForChild(props, props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(props as any)}>
                <OneOfDropDownAnt operation={operation} {...rest} />
            </FormItemAnt>
        );
    }
);

export const OneOfSelectAnt = observer((props: BindAntProps<OneOf> & SelectProps) => {
    const { operation, invisible, readOnly, mode, reason, ...rest } = parseProps(props, props.operation);
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
                {...rest}
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
});

export const OneOfSearchableSelectAnt = observer((props: BindAntProps<OneOf> & SelectProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { operation, invisible, readOnly, mode: _mode, reason, ...rest } = parseProps(props, props.operation);

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
                {...rest}
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
});

export const OneOfSelectFormAnt = observer((props: BindAntProps<OneOf> & BindFormItemAntProps & SelectProps) => {
    const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
    if (invisible) {
        return null;
    }
    return (
        <FormItemAnt operation={operation} {...(props as any)}>
            <OneOfSelectAnt operation={operation} {...rest} />
        </FormItemAnt>
    );
});

export const OneOfSearchableSelectFormAnt = observer(
    (props: BindAntProps<OneOf> & BindFormItemAntProps & SelectProps) => {
        const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(props as any)}>
                <OneOfSearchableSelectAnt operation={operation} {...rest} />
            </FormItemAnt>
        );
    }
);
