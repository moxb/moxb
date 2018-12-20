import { observer } from 'mobx-react';
import * as React from 'react';
import { Select, Radio } from 'antd';
import { SelectProps, OptionProps } from 'antd/lib/select';
import { RadioProps, RadioGroupProps } from 'antd/lib/radio';
import { BindAntProps, parseProps } from './BindAnt';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { FormItemAnt, BindFormItemAntProps, parsePropsForChild } from './FormItemAnt';
import { OneOf } from '@moxb/moxb';

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
        const { operation, invisible, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
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
export class OneOfSelectAnt extends React.Component<BindAntProps<OneOf> & SelectProps> {
    render() {
        const { operation, invisible, value, placeholder, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <Select
                onChange={(selectionValue: any) => operation.setValue(selectionValue)}
                value={this.props.operation.value || ''}
                placeholder={placeholder}
                mode="default"
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

/**
 * I have copied this interface from then antd library,
 * so that we can find and enable whatever options we need for OneOfSelectFormAnt.
 * (This is a merged version of AbstractSelectProps and SelectProps, with some obviously irrelevant props dropped.)
 *
 * OneOfSelectAnt has SelectProps merged to it's props, but we can't do what for FormAntSelectProps,
 * because many of the properties here are actually conflicting with what we are doing with the model.
 * So we would need to evaluate these one by one, and enable only what we need, when we need it.
 * For now, I enabled what I needed.
 */
interface SelectStylingProps {
    // prefixCls?: string;
    // className?: string;
    // size?: 'default' | 'large' | 'small';
    // notFoundContent?: React.ReactNode | null;
    // transitionName?: string;
    // choiceTransitionName?: string;
    showSearch?: boolean;
    // allowClear?: boolean;
    // showArrow?: boolean;
    // style?: React.CSSProperties;
    // tabIndex?: number;
    // placeholder?: string | React.ReactNode;
    // defaultActiveFirstOption?: boolean;
    // dropdownClassName?: string;
    // dropdownStyle?: React.CSSProperties;
    // dropdownMenuStyle?: React.CSSProperties;
    // dropdownMatchSelectWidth?: boolean;
    // onSearch?: (value: string) => any;
    // getPopupContainer?: (triggerNode: Element) => HTMLElement;
    filterOption?: boolean | ((inputValue: string, option: React.ReactElement<OptionProps>) => any);
    // defaultOpen?: boolean;
    // open?: boolean;
    // onDropdownVisibleChange?: (open: boolean) => void;
    // autoClearSearchValue?: boolean;
    // mode?: 'default' | 'multiple' | 'tags' | 'combobox' | string;
    // optionLabelProp?: string;
    // firstActiveValue?: string | string[];
    // onBlur?: (value: SelectValue) => void;
    // onFocus?: () => void;
    // onPopupScroll?: React.UIEventHandler<HTMLDivElement>;
    // onInputKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    // onMouseEnter?: (e: React.MouseEvent<HTMLInputElement>) => any;
    // onMouseLeave?: (e: React.MouseEvent<HTMLInputElement>) => any;
    // maxTagCount?: number;
    // maxTagPlaceholder?: React.ReactNode | ((omittedValues: SelectValue[]) => React.ReactNode);
    // optionFilterProp?: string;
    // labelInValue?: boolean;
    // tokenSeparators?: string[];
    // autoFocus?: boolean;
    // suffixIcon?: React.ReactNode;
}

@observer
export class OneOfSelectFormAnt extends React.Component<
    BindAntProps<OneOf> & BindFormItemAntProps & SelectStylingProps
> {
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
