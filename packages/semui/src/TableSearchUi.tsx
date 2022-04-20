import { TableSearch } from '@moxb/moxb';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Form, Icon } from 'semantic-ui-react';
import { ActionButtonUi, ActionFormButtonUi } from './ActionUi';
import { TextUi } from './TextUi';

export interface BindTableSearchUiProps {
    search: TableSearch;
    style?: React.CSSProperties;
    noAlignment?: boolean;
}

export const TableSearchUi = observer((props: BindTableSearchUiProps) => {
    const { search, noAlignment } = props;
    return (
        <Form style={props.style} className={noAlignment ? undefined : 'container'}>
            <Form.Group inline>
                <TextUi operation={search.searchField} style={{ minWidth: '250px' }} />
                <ActionFormButtonUi type="submit" operation={search.searchAction} />
                <ActionButtonUi operation={search.clearSearch} className="clearBtn">
                    <Icon name="x" style={{ marginLeft: '5px' }} />
                </ActionButtonUi>
            </Form.Group>
        </Form>
    );
});
