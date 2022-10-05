import { css } from '@emotion/css';
import { Numeric } from '@moxb/moxb';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { BindAntProps, parseProps } from './BindAnt';
import { Slider, Row, Col, SliderSingleProps } from 'antd';
import { BindFormItemAntProps, FormItemAnt, parsePropsForChild } from './FormItemAnt';
import { getCSSBackgroundForIntervals, IntervalColoringInput } from '@moxb/react-html';

export type SliderIntervalColoring = Omit<IntervalColoringInput, 'min' | 'max'>;

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

    /**
     * Should we color the slide, according to specific intervals?
     */
    intervalColoring?: SliderIntervalColoring;
}

type WidgetProps = Pick<SliderSingleProps, 'handleStyle'>;

export const SliderAnt = observer((props: SliderAntProps & WidgetProps) => {
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
        handleStyle,
        intervalColoring,
    } = allProps;

    const extraClassName = intervalColoring
        ? css({
              '.ant-slider-rail': {
                  background: getCSSBackgroundForIntervals({
                      ...intervalColoring,
                      min: operation.min ?? 0,
                      max: operation.max || 1000,
                  }),
              },
              '.ant-slider-track': {
                  opacity: 0,
              },
          })
        : undefined;

    const renderSlider = () => (
        <div className={extraClassName}>
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
                handleStyle={handleStyle}
            />
        </div>
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
