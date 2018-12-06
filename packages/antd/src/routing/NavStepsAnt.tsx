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

const Step = Steps.Step;

export interface NavStepsProps<DataType>
    extends LocationDependentStateSpaceHandlerProps<UIFragment, UIFragmentSpec, DataType> {
    stepProps?: StepsProps;
}

@observer
export class NavStepsAnt<DataType> extends React.Component<NavStepsProps<DataType>> {
    protected readonly _id: string;
    protected readonly _states: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, DataType>;

    constructor(props: NavStepsProps<DataType>) {
        super(props);
        const { id, stepProps, ...stateProps } = props;
        this._id = id || 'no-id';
        this._states = new LocationDependentStateSpaceHandlerImpl({
            ...stateProps,
            id: 'steps for ' + id,
        });
    }

    protected _renderSubStateElement(state: SubStateInContext<UIFragment, UIFragmentSpec, DataType>) {
        return <Step key={state.menuKey} title={state.label} />;
    }

    render() {
        const states = this._states.getFilteredSubStates({
            onlyVisible: true,
            onlySatisfying: true,
        });
        const { stepProps = {} } = this.props;
        const stateKeys = states.map(s => s.menuKey);
        const selectedMenuKeys = this._states.getActiveSubStateMenuKeys(true);
        const index = stateKeys.indexOf(selectedMenuKeys[0]);
        return (
            <Steps {...stepProps} current={index}>
                {states.map(this._renderSubStateElement)}
            </Steps>
        );
    }
}
