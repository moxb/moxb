import { Numeric } from '@moxb/moxb';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { BindAntProps, parseProps } from './BindAnt';
import { Slider, Row, Col } from 'antd';
import { BindFormItemAntProps, FormItemAnt, parsePropsForChild } from './FormItemAnt';

export interface SliderAntProps extends BindAntProps<Numeric> {
    showNumber?: boolean;
}

export const SliderAnt = observer((props: SliderAntProps) => {
    const { operation, invisible, showNumber = false, reason } = parseProps(props, props.operation);

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
            value={operation.value}
            step={operation.step}
        />
    );

    if (invisible) {
        return null;
    }
    const formatter = (value?: number | string) => (operation.unit ? `${value}${operation.unit}` : `${value}`);
    return showNumber ? (
        <Row title={reason}>
            <Col span={2}>
                <span style={{ marginRight: '1em' }}>{formatter(operation.value)}</span>
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
