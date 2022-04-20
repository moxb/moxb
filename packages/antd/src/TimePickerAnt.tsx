import { Time } from '@moxb/moxb';
import { TimePicker } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import { TimePickerProps } from 'antd/lib/time-picker';
import { observer } from 'mobx-react-lite';
import * as moment from 'moment';
import * as React from 'react';
import { CSSProperties } from 'react';
import { parseProps } from './BindAnt';
import { FormItemAnt, parsePropsForChild } from './FormItemAnt';

export interface BindTimePickerAntProps extends TimePickerProps {
    operation: Time;
    formStyle?: CSSProperties;
}

export const TimePickerAnt = observer((props: BindTimePickerAntProps) => {
    const { operation, invisible, reason, ...rest } = parseProps(props, props.operation);
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
                {...(rest as any)}
            />
        </span>
    );
});

export const TimePickerFormAnt = observer((props: BindTimePickerAntProps & Partial<FormItemProps>) => {
    const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
    if (invisible) {
        return null;
    }
    return (
        <FormItemAnt operation={operation} {...(props as any)}>
            <TimePickerAnt operation={operation} {...rest} />
        </FormItemAnt>
    );
});
