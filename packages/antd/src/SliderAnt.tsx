import { Numeric } from '@moxb/moxb';
import * as React from 'react';
import { observer } from 'mobx-react';
import { BindAntProps, parseProps } from './BindAnt';
import { Slider, Row, Col } from 'antd';
import { BindFormItemAntProps, FormItemAnt, parsePropsForChild } from './FormItemAnt';

export interface SliderAntProps extends BindAntProps<Numeric> {
    showNumber?: boolean;
}

@observer
export class SliderAnt extends React.Component<SliderAntProps> {
    protected renderSlider() {
        const { operation } = this.props;
        return (
            <Slider
                min={operation.min}
                max={operation.max}
                onChange={(rawValue) => {
                    const value = rawValue as number; // TS definition is wrong here
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
    }

    render() {
        const { operation, invisible, showNumber = false, reason } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        const formatter = (value?: number | string) => (operation.unit ? `${value}${operation.unit}` : `${value}`);
        return showNumber ? (
            <Row title={reason}>
                <Col span={2}>
                    <span style={{ marginRight: '1em' }}>{formatter(operation.value)}</span>
                </Col>
                <Col span={22}>{this.renderSlider()}</Col>
            </Row>
        ) : (
            this.renderSlider()
        );
    }
}

@observer
export class SliderFormAnt extends React.Component<SliderAntProps & BindFormItemAntProps> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(this.props as any)}>
                <SliderAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}
