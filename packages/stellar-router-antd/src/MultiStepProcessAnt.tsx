import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Alert, Col, Row } from 'antd';
import { StepsProps } from 'antd/lib/steps';

import { UIFragmentSpec } from '@moxb/react-html';
import { ActionButtonAnt } from '@moxb/antd';

import { MultiStepProcess, StateSpace, LocationDependentArea } from '@moxb/stellar-router-react';

import { NavStepsAnt, StepStatus } from './NavStepsAnt';

export interface MultiStepProcessProps<Step> {
    id: string;
    operation: MultiStepProcess<Step>;
    steps: StateSpace<any, UIFragmentSpec, any>;
}

export const MultiStepProcessAnt = observer((props: MultiStepProcessProps<any>) => {
    const { operation, steps, id } = props;
    const { currentStep, finished, failed } = operation;

    function getStatus(): StepStatus {
        if (finished) {
            return StepStatus.FINISH;
        }
        if (failed) {
            return StepStatus.ERROR;
        }
        return StepStatus.PROCESS;
    }

    function renderError() {
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

    const stepProps: StepsProps = {
        status: getStatus(),
    };

    return (
        <div data-testid={id}>
            <NavStepsAnt arg={currentStep} id={id + '-steps-indicator'} stateSpace={steps} stepProps={stepProps} />
            {failed ? renderError() : <LocationDependentArea arg={currentStep} id={id + '-steps'} stateSpace={steps} />}
        </div>
    );
});
