import { MultiStepProcess, StateSpace } from '@moxb/moxb';
import { Alert, Col, Row } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ActionButtonAnt } from '../ActionAnt';
import { LocationDependentArea, UIFragmentSpec } from '@moxb/html';
import { NavStepsAnt, StepsProps, StepStatus } from './NavStepsAnt';

export interface MultiStepProcessProps<Step> {
    id: string;
    operation: MultiStepProcess<Step>;
    steps: StateSpace<any, UIFragmentSpec, any>;
}

export const MultiStepProcessAnt = observer(
    class MultiStepProcessAnt extends React.Component<MultiStepProcessProps<any>> {
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
                    <Row justify="center" style={{ marginTop: '2rem' }}>
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
                <div data-testid={id}>
                    <NavStepsAnt arg={currentStep} id={id + '-steps-indicator'} stateSpace={steps} stepProps={stepProps} />
                    {failed ? (
                        this.renderError()
                    ) : (
                        <LocationDependentArea arg={currentStep} id={id + '-steps'} stateSpace={steps} />
                    )}
                </div>
            );
        }
    }
);
