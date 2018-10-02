import { FormItemProps } from 'antd/lib/form';
import { observer } from 'mobx-react';
import { CSSProperties } from 'react';
import * as React from 'react';
import { DatePicker } from 'antd';
import { DatePickerProps } from 'antd/lib/date-picker/interface';
import { parseProps } from './BindAnt';
import { Date } from '@moxb/moxb';
import { FormItemAnt } from './FormItemAnt';

export interface BindDatePickerAntProps extends DatePickerProps {
    operation: Date;
    formStyle?: CSSProperties;
}

@observer
export class DatePickerAnt extends React.Component<BindDatePickerAntProps> {
    render() {
        const { operation, ...props } = parseProps(this.props, this.props.operation);
        return (
            <DatePicker
                placeholder={operation.placeholder}
                onChange={(date: any, dateString: string) => operation.setValue(dateString)}
                {...props as any}
            />
        );
    }
}

@observer
export class DatePickerFormAnt extends React.Component<BindDatePickerAntProps & FormItemProps> {
    render() {
        const { operation, label, formStyle, wrapperCol, labelCol, invisible, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt
                operation={operation}
                label={label}
                formStyle={formStyle}
                labelCol={labelCol}
                wrapperCol={wrapperCol}
            >
                <DatePickerAnt operation={operation} {...props as any} />
            </FormItemAnt>
        );
    }
}
