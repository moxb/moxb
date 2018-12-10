import * as React from 'react';
import { observer } from 'mobx-react';
import { Row, Col, Alert } from 'antd';
import { StateSpace, MultiStepProcess } from '@moxb/moxb';
import { LocationDependentArea, UIFragmentSpec } from '../not-antd';
import { NavStepsAnt, StepsProps, StepStatus } from './NavStepsAnt';
import { ActionButtonAnt } from '../ActionAnt';

export interface MultiStepProcessProps<Step> {
    id: string;
    operation: MultiStepProcess<Step>;
    steps: StateSpace<any, UIFragmentSpec, any>;
}

@observer
export class MultiStepProcessAnt extends React.Component<MultiStepProcessProps<any>> {
    getStatus(): StepStatus {
        const { operation } = this.props;
        const { finished, failed } = operation;
        if (finished) {
            return StepStatus.FINISH;
        }
        if (failed) {
            return StepStatus.ERROR;
        }
        return StepStatus.PROCESS;
    }

    renderError() {
        const { operation } = this.props;
        const { errorMessage, finish } = operation;
        return (
            <div>
                <Row type="flex" justify="center" style={{ marginTop: '2rem' }}>
                    <Col span={14}>
                        <Alert message="Error" description={errorMessage} type="error" showIcon />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ActionButtonAnt operation={finish} />
                    </Col>
                </Row>
            </div>
        );
    }

    render() {
        const { operation, steps, id } = this.props;
        const { currentStep, failed } = operation;
        const stepProps: StepsProps = {
            status: this.getStatus(),
        };
        return (
            <div>
                <NavStepsAnt arg={currentStep} id={id + '-steps-indicator'} subStates={steps} stepProps={stepProps} />
                {failed ? (
                    this.renderError()
                ) : (
                    <LocationDependentArea arg={currentStep} id={id + '-steps'} subStates={steps} />
                )}
            </div>
        );
    }
}
