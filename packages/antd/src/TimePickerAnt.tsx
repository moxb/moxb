import { FormItemProps } from 'antd/lib/form';
import { observer } from 'mobx-react';
import { CSSProperties } from 'react';
import * as React from 'react';
import { TimePicker } from 'antd';
import { TimePickerProps } from 'antd/lib/time-picker';
import { parseProps } from './BindAnt';
import { Time } from '@moxb/moxb';
import { FormItemAnt, parsePropsForChild } from './FormItemAnt';

export interface BindTimePickerAntProps extends TimePickerProps {
    operation: Time;
    formStyle?: CSSProperties;
}

@observer
export class TimePickerAnt extends React.Component<BindTimePickerAntProps> {
    render() {
        const { operation, invisible, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
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
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...this.props as any}>
                <TimePickerAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}
