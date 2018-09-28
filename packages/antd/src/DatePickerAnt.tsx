import { FormItemProps } from 'antd/lib/form';
import { observer } from 'mobx-react';
import * as React from 'react';
import { DatePicker, Form } from 'antd';
import { DatePickerProps } from 'antd/lib/date-picker/interface';
import { parseProps, getErrorMessages } from './BindAnt';
import { Date } from '@moxb/moxb';

export interface BindDatePickerAntProps extends DatePickerProps {
    operation: Date;
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
        const { operation, ...props } = parseProps(this.props, this.props.operation);
        return (
            <Form.Item
                required={operation.required}
                hasFeedback={operation.hasErrors}
                validateStatus={operation.hasErrors ? 'error' : undefined}
                help={operation.hasErrors ? getErrorMessages(operation.errors!) : null}
                {...props as any}
            >
                <DatePickerAnt operation={this.props.operation} />
            </Form.Item>
        );
    }
}
