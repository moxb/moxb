import * as React from 'react';
import { DateRange } from '@moxb/moxb';
import { CSSProperties } from 'react';
import { RangePickerProps } from 'antd/lib/date-picker';
import { observer } from 'mobx-react';
import { parseProps } from './BindAnt';
import { DatePicker } from 'antd';
import * as moment from 'moment';
import { FormItemProps } from 'antd/lib/form';
import { FormItemAnt, parsePropsForChild } from './FormItemAnt';

interface BindDateRangePickerAntBasicProps {
    operation: DateRange;
    formStyle?: CSSProperties;
}

export type BindDateRangePickerAntProps = BindDateRangePickerAntBasicProps & RangePickerProps;

export const DateRangePickerAnt = observer(
    class DateRangePickerAnt extends React.Component<BindDateRangePickerAntProps> {
        render() {
            const { operation, invisible, reason, ...props } = parseProps(this.props, this.props.operation);
            if (invisible) {
                return null;
            }
            return (
                <span title={reason}>
                    <DatePicker.RangePicker
                        data-testid={operation.id}
                        placeholder={operation.placeholder}
                        value={operation.value}
                        onChange={(date: [moment.Moment, moment.Moment], _dateString: string) => operation.setValue(date)}
                        ranges={operation.ranges}
                        {...(props as any)}
                    />
                </span>
            );
        }
    }
);

export const DateRangePickerFormAnt = observer(
    class DateRangePickerFormAnt extends React.Component<BindDateRangePickerAntProps & Partial<FormItemProps>> {
        render() {
            const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
            if (invisible) {
                return null;
            }
            return (
                <FormItemAnt operation={operation} {...(this.props as any)}>
                    <DateRangePickerAnt operation={operation} {...props} />
                </FormItemAnt>
            );
        }
    }
);
