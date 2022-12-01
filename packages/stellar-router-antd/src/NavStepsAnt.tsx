import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Steps } from 'antd';
import { StepsProps } from 'antd/lib/steps';

import { idToDomId } from '@moxb/util';
import { UIFragment, UIFragmentSpec } from '@moxb/react-html';

import {
    LocationDependentStateSpaceHandlerImpl,
    LocationDependentStateSpaceHandlerProps,
    SubStateInContext,
    useLocationManager,
    useTokenManager,
} from '@moxb/stellar-router-react';

const Step = Steps.Step;

export enum StepStatus {
    // WAIT = 'wait',
    PROCESS = 'process',
    FINISH = 'finish',
    ERROR = 'error',
}

export interface NavStepsProps<DataType>
    extends Omit<LocationDependentStateSpaceHandlerProps<UIFragment, UIFragmentSpec, DataType>, 'locationManager'> {
    stepProps?: StepsProps;

    children?: React.ReactNode;
}

export const NavStepsAnt = observer((props: NavStepsProps<unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, stepProps = {}, children: _children, ...stateProps } = props;

    const locationManager = useLocationManager('NavStepsAnt');
    const tokenManager = useTokenManager();

    const states = new LocationDependentStateSpaceHandlerImpl({
        ...stateProps,
        locationManager,
        tokenManager,
        id: 'steps for ' + id,
    });

    const visibleStates = states.getFilteredSubStates({
        onlyVisible: true,
        onlySatisfying: true,
    });

    function renderSubStateElement(state: SubStateInContext<UIFragment, UIFragmentSpec, unknown>) {
        const newId = idToDomId(`${props.id}.step.${state.menuKey}`);
        return <Step data-testid={newId} key={state.menuKey} title={<>{state.label}</>} />;
    }

    const visibleStateKeys = visibleStates.map((s) => s.menuKey);
    const selectedMenuKeys = states.getActiveSubStateMenuKeys(true);
    const index = visibleStateKeys.indexOf(selectedMenuKeys[0]);
    return (
        <Steps data-testid={id} {...stepProps} current={index}>
            {visibleStates.map(renderSubStateElement)}
        </Steps>
    );
});
