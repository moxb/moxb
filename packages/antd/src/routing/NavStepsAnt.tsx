import * as React from 'react';
import { observer } from 'mobx-react';
import {
    SubStateInContext,
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerProps,
    LocationDependentStateSpaceHandlerImpl,
} from '@moxb/moxb';
import { UIFragment, UIFragmentSpec } from '../not-antd';
import { Steps } from 'antd';
import { StepsProps } from 'antd/lib/steps';
export { StepsProps } from 'antd/lib/steps';

const Step = Steps.Step;

export enum StepStatus {
    WAIT = 'wait',
    PROCESS = 'process',
    FINISH = 'finish',
    ERROR = 'error',
}

export interface NavStepsProps<DataType>
    extends LocationDependentStateSpaceHandlerProps<UIFragment, UIFragmentSpec, DataType> {
    stepProps?: StepsProps;

    /**
     * Optionally, you can declare that the set of available states will never change.
     *
     * This makes some performance improvements possible.
     */
    staticStates?: boolean;
}

@observer
export class NavStepsAnt<DataType> extends React.Component<NavStepsProps<DataType>> {
    protected readonly _id: string;
    protected readonly _states: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, DataType> | undefined;

    constructor(props: NavStepsProps<DataType>) {
        super(props);
        this._id = props.id || 'no-id';

        const { id, stepProps = {}, staticStates, children, ...stateProps } = this.props;
        this._states = staticStates
            ? new LocationDependentStateSpaceHandlerImpl({
                  ...stateProps,
                  id: 'steps for ' + id,
              })
            : undefined;
    }

    protected getStates(): LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, DataType> {
        if (this._states) {
            return this._states;
        }
        const { id, stepProps = {}, staticStates, children, ...stateProps } = this.props;
        return new LocationDependentStateSpaceHandlerImpl({
            ...stateProps,
            id: 'steps for ' + id,
        });
    }

    protected _renderSubStateElement(state: SubStateInContext<UIFragment, UIFragmentSpec, DataType>) {
        return <Step key={state.menuKey} title={state.label} />;
    }

    render() {
        const { stepProps = {} } = this.props;
        const _states = this.getStates();
        const visibleStates = _states.getFilteredSubStates({
            onlyVisible: true,
            onlySatisfying: true,
        });
        const visibleStateKeys = visibleStates.map(s => s.menuKey);
        const selectedMenuKeys = _states.getActiveSubStateMenuKeys(true);
        const index = visibleStateKeys.indexOf(selectedMenuKeys[0]);
        return (
            <Steps {...stepProps} current={index}>
                {visibleStates.map(this._renderSubStateElement)}
            </Steps>
        );
    }
}
