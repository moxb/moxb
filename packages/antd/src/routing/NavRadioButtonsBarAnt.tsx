import {
    idToDomId,
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerImpl,
    LocationDependentStateSpaceHandlerProps,
    OneOfImpl,
} from '@moxb/moxb';
import { observer } from 'mobx-react-lite';
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

    children?: React.ReactNode;
}

export const NavRadioButtonBarAnt = observer((props: NavRadioButtonBarProps<unknown>) => {
    const { id, extra, style } = props;

    function getLocationDependantStateSpaceHandler(): LocationDependentStateSpaceHandler<
        UIFragment,
        UIFragmentSpec,
        unknown
    > {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, children: _children, extra: _extra, style: _style, ...stateProps } = props;

        return new LocationDependentStateSpaceHandlerImpl({
            ...stateProps,
            id: 'tab bar of ' + (id || 'no-id'),
            intercept: true,
        });
    }

    const states: LocationDependentStateSpaceHandler<
        UIFragment,
        UIFragmentSpec,
        unknown
    > = getLocationDependantStateSpaceHandler();

    const operation = new OneOfImpl({
        id: 'oneOf.' + id,
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
    const newId = idToDomId('navRadioButtonsBar.' + id);
    return (
        <div data-testid={newId} id={newId} style={style}>
            <OneOfButtonAnt operation={operation} />
            {renderUIFragment(extra)}
        </div>
    );
});
