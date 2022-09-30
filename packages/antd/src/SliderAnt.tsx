import { Numeric } from '@moxb/moxb';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { BindAntProps, parseProps } from './BindAnt';
import { Slider, Row, Col } from 'antd';
import { BindFormItemAntProps, FormItemAnt, parsePropsForChild } from './FormItemAnt';

export interface SliderAntProps extends BindAntProps<Numeric> {
    showNumber?: boolean;
    /**
     * How should we format the number, when displaying it?
     */
    formatter?: (value: number | undefined) => string;

    /**
     * How should we display the number, when displaying it before the slider?
     *
     * If provided, will override `formatter`.
     */
    labelFormatter?: (value: number | undefined) => string;

    /**
     * How should we display the number, when displaying it in the tooltip
     *
     * If provided, will override `formatter`.
     */
    toolTipFormatter?: (value: number | undefined) => string;
}

export const SliderAnt = observer((props: SliderAntProps) => {
    const allProps = parseProps(props, props.operation);
    const defaultFormatter = (value?: number | string) => (operation.unit ? `${value}${operation.unit}` : `${value}`);
    const { formatter = defaultFormatter } = allProps;
    const {
        operation,
        invisible,
        showNumber = false,
        reason,
        labelFormatter = formatter,
        toolTipFormatter = formatter,
    } = allProps;

    const renderSlider = () => (
        <Slider
            min={operation.min}
            max={operation.max}
            onChange={(value: number) => {
                if (isNaN(value)) {
                    return;
                }
                operation.setValue(value);
                operation.onExitField();
            }}
            tooltip={{
                formatter: (_v: number | undefined) => <span>{toolTipFormatter(_v)}</span>,
            }}
            value={operation.value}
            step={operation.step}
        />
    );

    if (invisible) {
        return null;
    }

    return showNumber ? (
        <Row title={reason}>
            <Col span={2}>
                <span style={{ marginRight: '1em' }}>{labelFormatter(operation.value)}</span>
            </Col>
            <Col span={22}>{renderSlider()}</Col>
        </Row>
    ) : (
        renderSlider()
    );
});

export const SliderFormAnt = observer((props: SliderAntProps & BindFormItemAntProps) => {
    const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
    if (invisible) {
        return null;
    }
    return (
        <FormItemAnt operation={operation} {...(props as any)}>
            <SliderAnt operation={operation} {...rest} />
        </FormItemAnt>
    );
});
