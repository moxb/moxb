import { Time } from '@moxb/moxb';
import { TimePicker } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import { TimePickerProps } from 'antd/lib/time-picker';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import { CSSProperties } from 'react';
import { parseProps } from './BindAnt';
import { FormItemAnt, parsePropsForChild } from './FormItemAnt';

export interface BindTimePickerAntProps extends TimePickerProps {
    operation: Time;
    formStyle?: CSSProperties;
}

export const TimePickerAnt = observer(class TimePickerAnt extends React.Component<BindTimePickerAntProps> {
    render() {
        const { operation, invisible, reason, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <span title={reason}>
                <TimePicker
                    data-testid={operation.id}
                    placeholder={operation.placeholder}
                    value={operation.value}
                    onChange={(time: moment.Moment, _timeString: string) => operation.setValue(time)}
                    {...(props as any)}
                />
            </span>
        );
    }
});

export const TimePickerFormAnt = observer(
    class TimePickerFormAnt extends React.Component<BindTimePickerAntProps & Partial<FormItemProps>> {
        render() {
            const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
            if (invisible) {
                return null;
            }
            return (
                <FormItemAnt operation={operation} {...(this.props as any)}>
                    <TimePickerAnt operation={operation} {...props} />
                </FormItemAnt>
            );
        }
    }
);
