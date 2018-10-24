import * as React from 'react';
import { Menu } from 'antd';
import { observer, inject } from 'mobx-react';
import { StateSpaceAndLocationHandler, StateSpaceAndLocationHandlerProps, StateSpaceAndLocationHandlerImpl } from '@moxb/moxb';

// TODO: this should be imported from antd/menu, but I couldn't find out
// how to do it.
interface ClickParam {
    key: string;
    keyPath: Array<string>;
    item: any;
    domEvent: any;
}

import { SubState, renderFragment } from '@moxb/moxb';

export interface NavMenuProps extends StateSpaceAndLocationHandlerProps {
    hierarchical?: boolean;
    right?: boolean;
}

@inject( 'locationManager' )
@observer
export class NavMenuBarAnt extends React.Component<NavMenuProps> {

    private readonly _states: StateSpaceAndLocationHandler;

    public constructor(props: NavMenuProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.renderSubStateLink = this.renderSubStateLink.bind(this);
        this._states = new StateSpaceAndLocationHandlerImpl(props);
    }

    protected renderSubStateLinkGroup(state: SubState) {
        const { label, key, subStates } = state;
        return (
            <Menu.SubMenu key={key} title={ renderFragment(label) }>
                { subStates!.map(this.renderSubStateLink) }
            </Menu.SubMenu>
        );

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
    }

    protected renderSubStateLink(state: SubState) {
        const { label, key, root, subStates } = state;
        if (subStates) {
            return this.renderSubStateLinkGroup(state);
        } else {
            return <Menu.Item key={root ? '_root_' : key}>{renderFragment(label)}</Menu.Item>;
        }
    }

    protected handleClick(e: ClickParam) {
        this._states.selectKey(e.key);
    }

    public render() {
        const selectedKeys=this._states.getActiveSubStateKeys();
//        console.log("Selected keys are", selectedKeys);
        return (
            <Menu
                selectedKeys = { selectedKeys }
                mode="horizontal"
                style={{ lineHeight: '64px' }}
                onClick={this.handleClick}
            >
                { this._states.getFilteredSubStates().map(this.renderSubStateLink) }
            </Menu>
        );
    }
}
