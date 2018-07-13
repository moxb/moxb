import { observer } from 'mobx-react';
import * as React from 'react';
import { Form, Icon } from 'semantic-ui-react';
import { ActionButtonUi, ActionUi } from '../action/ActionUi';
import { TextUi } from '../text/TextUi';
import { TableSearch } from './TableSearch';

export interface BindTableSearchUiProps {
    search: TableSearch;
    style?: {};
    noAlignment?: boolean;
}

@observer
export class TableSearchUi extends React.Component<BindTableSearchUiProps> {
    render() {
        const { search, noAlignment } = this.props;
        return (
            <Form style={this.props.style} className={noAlignment ? undefined : 'container'}>
                <Form.Group inline>
                    <TextUi operation={search.searchField} style={{ minWidth: '250px' }} />
                    <ActionUi type="submit" operation={search.searchAction} />
                    <ActionButtonUi operation={search.clearSearch} className="clearBtn">
                        <Icon name="x" style={{ marginLeft: '5px' }} />
                    </ActionButtonUi>
                </Form.Group>
            </Form>
        );
    }
}
