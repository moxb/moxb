import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Select } from 'antd';
import { BindUiProps, parseProps } from './BindUi';
import { ManyOf } from '@moxb/moxb';
import { SelectProps } from 'antd/lib/select';

const Option = Select.Option;

@observer
export class ManyOfUi extends React.Component<BindUiProps<ManyOf> & SelectProps> {
    render() {
        const { operation, invisible, mode, children, defaultValue, placeholder, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible || operation.invisible) {
            return null;
        }
        // make sure the value is not a mobx object...
        const value = toJS(operation.value);
        return (
            <Select
                onChange={(selectionValue: any) => operation.setValue(selectionValue)}
                value={value}
                placeholder={placeholder}
                defaultValue={defaultValue}
                mode={typeof mode === 'undefined' ? 'default' : mode}
                {...props}
            >
                {operation.choices.map(opt => (
                    <Option key={opt.value} value={opt.value}>
                        {opt.label}
                    </Option>
                ))}
                {children}
            </Select>
        );
    }
}
