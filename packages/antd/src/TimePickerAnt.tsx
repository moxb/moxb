import { FormItemProps } from 'antd/lib/form';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TimePicker, Form } from 'antd';
import { TimePickerProps } from 'antd/lib/time-picker';
import { parseProps, getErrorMessages } from './BindAnt';
import { Time } from '@moxb/moxb';

export interface BindTimePickerAntProps extends TimePickerProps {
    operation: Time;
}

@observer
export class TimePickerAnt extends React.Component<BindTimePickerAntProps> {
    render() {
        const { operation, ...props } = parseProps(this.props, this.props.operation);
        return (
            <TimePicker
                placeholder={operation.placeholder}
                onChange={(time: any, timeString: string) => operation.setValue(timeString)}
                {...props as any}
            />
        );
    }
}

@observer
export class TimePickerFormAnt extends React.Component<BindTimePickerAntProps & FormItemProps> {
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
                <TimePickerAnt operation={this.props.operation} />
            </Form.Item>
        );
    }
}
