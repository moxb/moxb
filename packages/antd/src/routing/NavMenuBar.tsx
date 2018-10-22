import * as React from 'react';
import { Menu } from 'antd';
import { observer } from 'mobx-react';
import { UrlArg } from '@moxb/moxb';

// TODO: this should be imported from antd/menu, but I couldn't find out
// how to do it.
interface ClickParam {
    key: string;
    keyPath: Array<string>;
    item: any;
    domEvent: any;
}

import { SubState, StateSpace, LocationManager, renderFragment } from '@moxb/moxb';

export type Condition = (item: SubState) => boolean;

export interface NavMenuProps {
    locationManager: LocationManager;
    rootPath?: string;
    arg?: UrlArg<string>;
    substates: StateSpace;
    condition?: Condition;
    hierarchical?: boolean;
    right?: boolean;
}

@observer
export class NavMenuBar extends React.Component<NavMenuProps, {}> {
    public constructor(props: NavMenuProps) {
        super(props);
        this.isSubStateActive = this.isSubStateActive.bind(this);
        this.handleClick = this.handleClick.bind(this);
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

    protected getPathForSubState(state: SubState) {
        const { locationManager, rootPath } = this.props;
        const { root, path } = state;
        const realRootPath = rootPath || locationManager.pathSeparator;
        const result = realRootPath + (root ? '' : path);
        return result;
    }

    protected isSubStateActive(state: SubState) {
        const { root, path } = state;
        const { locationManager, arg } = this.props;
        if (root || path) {
            if (arg) {
                return arg.value === path;
            } else {
                const toPath = this.getPathForSubState(state);
                return locationManager.isLinkActive(toPath, !!root);
            }
        } else {
            return false;
        }
    }

    protected findRoot(): SubState {
        const result = this.props.substates.find(state => !!state.root);
        if (result) {
            return result;
        } else {
            throw new Error("Can't find root subState");
        }
    }

    protected findSubState(path: string): SubState {
        if (path === '_root_') {
            return this.findRoot();
        }
        const result = this.props.substates.find(state => state.path === path);
        if (result) {
            return result;
        } else {
            throw new Error("Can't find subState for path " + path);
        }
    }

    protected handleClick(e: ClickParam) {
        const { locationManager, arg } = this.props;
        const state = this.findSubState(e.key);
        if (this.isSubStateActive(state)) {
            //            console.log("Not jumping, already there.");
        } else {
            if (arg) {
                arg.value = state.path as string;
            } else {
                const path = this.getPathForSubState(state);
                //                console.log("Jumping to '" + path + "'...");
                locationManager.path = path;
            }
        }
    }

    public render() {
        const { substates, condition } = this.props;

        const selectedKeys = substates.filter(this.isSubStateActive).map(state => state.path as string);

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
