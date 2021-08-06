import {
    idToDomId,
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerImpl,
    LocationDependentStateSpaceHandlerProps,
    OneOfImpl,
} from '@moxb/moxb';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { renderUIFragment, UIFragment, UIFragmentSpec } from '@moxb/html';
import { OneOfButtonAnt } from '../OneOfAnt';

export interface NavRadioButtonBarProps<DataType>
    extends LocationDependentStateSpaceHandlerProps<UIFragment, UIFragmentSpec, DataType> {
    /**
     * Any extra menu items to add
     */
    extra?: UIFragment;

    /**
     * Any direct styles to apply
     */
    style?: React.CSSProperties;
}

@inject('locationManager')
@observer
/**
 * This widget show an Ant tab bar, based on the state-space.
 */
export class NavRadioButtonBarAnt<DataType> extends React.Component<NavRadioButtonBarProps<DataType>> {
    protected getLocationDependantStateSpaceHandler(): LocationDependentStateSpaceHandler<
        UIFragment,
        UIFragmentSpec,
        DataType
    > {
        const { id, children: _children, extra, style, ...stateProps } = this.props;

        return new LocationDependentStateSpaceHandlerImpl({
            ...stateProps,
            id: 'tab bar of ' + (this.props.id || 'no-id'),
            intercept: true,
        });
    }

    public render() {
        const states: LocationDependentStateSpaceHandler<
            UIFragment,
            UIFragmentSpec,
            DataType
        > = this.getLocationDependantStateSpaceHandler();
        const { extra, style } = this.props;
        const operation = new OneOfImpl({
            id: 'oneOf.' + this.props.id,
            getValue: () => states.getActiveSubStateMenuKeys(true)[0],
            setValue: (value) => states.trySelectSubState(states.findStateForMenuKey(value)),
            choices: states
                .getFilteredSubStates({
                    onlyVisible: true,
                    onlySatisfying: true,
                })
                .map((state) => ({
                    value: state.menuKey,
                    widget: renderUIFragment(state.label),
                })),
        });
        const id = idToDomId('radioButtonMenu.' + this.props.id);
        return (
            <div data-testid={id} id={id} style={style}>
                <OneOfButtonAnt operation={operation} />
                {renderUIFragment(extra)}
            </div>
        );
    }
}
