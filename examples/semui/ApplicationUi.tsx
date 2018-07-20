import * as React from 'react';
import {
    ActionButtonUi,
    ActionUi,
    BoolUi,
    ActionDropdownItemUi,
    ConfirmUi,
    ManyOfUi,
    ModalUi,
    TextUi, NumericUi, OneOfUi, OneOfSelectUi, TableUi, TableSearchUi
} from '@moxb/semui';
import { inject, observer } from 'mobx-react';
import { Application } from './Application';
import { Container, Dropdown, Form, Table } from 'semantic-ui-react';

@inject('app')
@observer
export class ApplicationUi extends React.Component<{ app?: Application }> {
    render() {
        const application = this.props.app;

        return (<Container text><Form>
            <h1>Semantic UI Components</h1>
            <hr/>

            <h3>ActionButtonUI Component</h3>
            <ActionButtonUi color="blue" size="large" operation={application!.testAction} />

            <h3>ActionUI Component</h3>
            <ActionUi color="red" operation={application!.testAction} />

            <h3>ActionDropdownItemUi Component</h3>
            <Dropdown item text="Test dropdown">
                <Dropdown.Menu>
                    <ActionDropdownItemUi operation={application!.testAction} />
                </Dropdown.Menu>
            </Dropdown>
            <br/>

            <h3>BoolUI Component</h3>
            <BoolUi operation={application!.testBool} />
            {application!.showCheckbox &&
                <p><br/>Additional text is visible now!</p>
            }<br/>

            <h3>ConfirmUI Component</h3>
            <ConfirmUi confirm={application!.testConfirm} />
            <ActionUi size="tiny" operation={application!.newConfirmAction()} />
            <br/>

            <h3>ManyOfUi Component</h3>
            <div style={{width: '350px'}}>
                <ManyOfUi fluid multiple selection operation={application!.testManyOf} />
            </div>
            <br/>

            <h3>ModalUi Component</h3>
            <ActionUi size="tiny" color="green" operation={application!.newModalAction()} />
            <ModalUi modal={application!.testModal}>
                <TextUi fluid operation={application!.testText} />
            </ModalUi>
            <br/>

            <h3>TextUi - Input Component</h3>
            <TextUi fluid operation={application!.testTextfield} />

            <h3>TextUi - Textarea Component</h3>
            <TextUi fluid operation={application!.testTextarea} />
            <br/>

            <h3>NumericUi Component</h3>
            <NumericUi required operation={application!.testNumeric} />
            <br/>

            <h3>OneOf - RadioBox Component</h3>
            <OneOfUi operation={application!.testOfOne} />
            <br/>

            <h3>OneOf - Select Component</h3>
            <OneOfSelectUi operation={application!.testOfOne} />
            <br/>

            <h3>Table Component</h3>
            {/*TODO: Search and sorting is not working correctly now, needs rework from TablePage!*/}
            {/*<TableSearchUi search={application!.search} />*/}
            <TableUi table={application!.testTable}>
                {application!.testTable.data!.map((tableData:any) => (
                    <Table.Row key={tableData._id}>
                        <Table.Cell>{tableData.email}</Table.Cell>
                        <Table.Cell>{tableData.fullName}</Table.Cell>
                        <Table.Cell>{tableData.createdAt}</Table.Cell>
                    </Table.Row>
                ))}
            </TableUi>
            <br/>

            <div id="spacer" style={{paddingBottom: '100px'}} />
        </Form></Container>) ;
    }
}
