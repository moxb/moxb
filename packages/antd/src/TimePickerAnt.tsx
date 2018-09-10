import { observer } from 'mobx-react';
import * as React from 'react';
import { TimePicker } from 'antd';
import { TimePickerProps } from 'antd/lib/time-picker';
import { parseProps } from './BindAnt';
import { Time } from '@moxb/moxb';

export interface BindTimePickerAntProps {
    operation: Time;
}

@observer
export class TimePickerAnt extends React.Component<TimePickerProps & BindTimePickerAntProps> {
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
