import { observer } from 'mobx-react';
import * as React from 'react';
import { DatePicker } from 'antd';
import { DatePickerProps } from 'antd/lib/date-picker/interface';
import { parseProps } from './BindAnt';
import { Date } from '@moxb/moxb';

export interface BindDatePickerAntProps {
    operation: Date;
}

@observer
export class DatePickerAnt extends React.Component<DatePickerProps & BindDatePickerAntProps> {
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
