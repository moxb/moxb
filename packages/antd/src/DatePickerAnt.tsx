import { FormItemProps } from 'antd/lib/form';
import { observer } from 'mobx-react';
import { CSSProperties } from 'react';
import * as React from 'react';
import { DatePicker } from 'antd';
import { DatePickerProps } from 'antd/lib/date-picker/interface';
import { parseProps } from './BindAnt';
import { Date } from '@moxb/moxb';
import { FormItemAnt, parsePropsForChild } from './FormItemAnt';
import * as moment from 'moment';

export interface BindDatePickerAntProps extends DatePickerProps {
    operation: Date;
    formStyle?: CSSProperties;
}

@observer
export class DatePickerAnt extends React.Component<BindDatePickerAntProps> {
    render() {
        const { operation, invisible, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <DatePicker
                placeholder={operation.placeholder}
                value={operation.value}
                onChange={(date: moment.Moment, _dateString: string) => operation.setValue(date)}
                {...props as any}
            />
        );
    }
}

@observer
export class DatePickerFormAnt extends React.Component<BindDatePickerAntProps & FormItemProps> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...this.props as any}>
                <DatePickerAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}
