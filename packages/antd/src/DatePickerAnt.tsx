import { Date } from '@moxb/moxb';
import { DatePicker } from 'antd';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import { CSSProperties } from 'react';
import { parseProps } from './BindAnt';
import { FormItemAnt, parsePropsForChild } from './FormItemAnt';
import { DatePickerProps } from 'antd/lib/date-picker';
import { FormItemProps } from 'antd/lib/form';

interface BindDatePickerAntBasicProps {
    operation: Date;
    formStyle?: CSSProperties;
}

export type BindDatePickerAntProps = BindDatePickerAntBasicProps & DatePickerProps;

@observer
export class DatePickerAnt extends React.Component<BindDatePickerAntProps> {
    render() {
        const { operation, invisible, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <DatePicker
                data-testid={operation.id}
                placeholder={operation.placeholder}
                value={operation.value}
                onChange={(date: moment.Moment, _dateString: string) => operation.setValue(date)}
                {...(props as any)}
            />
        );
    }
}

@observer
export class DatePickerFormAnt extends React.Component<BindDatePickerAntProps & Partial<FormItemProps>> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(this.props as any)}>
                <DatePickerAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}
