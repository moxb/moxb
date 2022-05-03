import { Date } from '@moxb/moxb';
import { DatePicker } from 'antd';
import { observer } from 'mobx-react-lite';
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

export const DatePickerAnt = observer((props: BindDatePickerAntProps) => {
    const { operation, invisible, reason, ...rest } = parseProps(props, props.operation);
    if (invisible) {
        return null;
    }
    return (
        <span title={reason}>
            <DatePicker
                data-testid={operation.id}
                placeholder={operation.placeholder}
                value={operation.value}
                onChange={(date: moment.Moment, _dateString: string) => operation.setValue(date)}
                {...(rest as any)}
            />
        </span>
    );
});

export const DatePickerFormAnt = observer((props: BindDatePickerAntProps & Partial<FormItemProps>) => {
    const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
    if (invisible) {
        return null;
    }
    return (
        <FormItemAnt operation={operation} {...(props as any)}>
            <DatePickerAnt operation={operation} {...rest} />
        </FormItemAnt>
    );
});
