import * as React from 'react';
import { Menu } from 'antd';
import { observer } from 'mobx-react';
import { StateSpaceHandler, StateSpaceHandlerProps, StateSpaceHandlerImpl } from '@moxb/moxb';

// TODO: this should be imported from antd/menu, but I couldn't find out
// how to do it.
interface ClickParam {
    key: string;
    keyPath: Array<string>;
    item: any;
    domEvent: any;
}

import { SubState, renderFragment } from '@moxb/moxb';

export type Condition = (item: SubState) => boolean;

export interface NavMenuProps extends StateSpaceHandlerProps {
    condition?: Condition;
    hierarchical?: boolean;
    right?: boolean;
}

@observer
export class NavMenuBar extends React.Component<NavMenuProps, {}> {

    private readonly _states: StateSpaceHandler;

    public constructor(props: NavMenuProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this._states = new StateSpaceHandlerImpl(props);
    }

    protected renderSubStateLink(state: SubState) {
        const { label, path, root, hidden, subStates } = state;
        if (hidden) {
            return null;
        }
        if (subStates) {
            /*
            <NavLinkGroup
                rootPath={ rootPath }
                path={ toPath }
                hierarchical={ hierarchical }
                label={ label }
                substates= { subStates }
                condition={ condition }
                right={ right }
            />
*/

            return <span>Submenus are not yet supported</span>;
        } else {
            return <Menu.Item key={root ? '_root_' : path}>{renderFragment(label)}</Menu.Item>;
        }
    }

    protected handleClick(e: ClickParam) {
        const { locationManager, arg } = this.props;
        const state = this._states.findSubState(e.key);
        if (this._states.isSubStateActive(state)) {
            //            console.log("Not jumping, already there.");
        } else {
            if (arg) {
                arg.value = state.path as string;
            } else {
                const path = this._states.getPathForSubState(state);
                //                console.log("Jumping to '" + path + "'...");
                locationManager.path = path;
            }
        }
    }

    public render() {
        const { substates, condition } = this.props;

        const selectedKeys = this._states.getActiveSubStatePaths();

        return (
            <Menu
                mode="horizontal"
                style={{ lineHeight: '64px' }}
                selectedKeys={selectedKeys}
                onClick={this.handleClick}
            >
                {substates.map((state, _index) => {
                    if (condition && !condition(state)) {
                        //                console.log("Hiding item");
                        return null;
                    } else {
                        return this.renderSubStateLink(state);
                    }
                })}
            </Menu>
        );
    }
}
