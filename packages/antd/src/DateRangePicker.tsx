import * as React from 'react';
import { DateRange } from '@moxb/moxb';
import { CSSProperties } from 'react';
import { RangePickerProps } from 'antd/lib/date-picker';
import { observer } from 'mobx-react-lite';
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

export const DateRangePickerAnt = observer((props: BindDateRangePickerAntProps) => {
    const { operation, invisible, reason, ...rest } = parseProps(props, props.operation);
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
                {...(rest as any)}
            />
        </span>
    );
});

export const DateRangePickerFormAnt = observer((props: BindDateRangePickerAntProps & Partial<FormItemProps>) => {
    const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
    if (invisible) {
        return null;
    }
    return (
        <FormItemAnt operation={operation} {...(props as any)}>
            <DateRangePickerAnt operation={operation} {...rest} />
        </FormItemAnt>
    );
});
