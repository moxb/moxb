import * as React from 'react';
import {
    ActionButtonUi,
    ActionFormButtonUi,
    BoolUi,
    ActionDropdownItemUi,
    ConfirmUi,
    ManyOfUi,
    ModalUi,
    TextUi,
    NumericUi,
    OneOfUi,
    OneOfSelectUi,
} from '@moxb/semui';
import { inject, observer } from 'mobx-react';
import { Application } from './Application';
import { Container, Dropdown, Form } from 'semantic-ui-react';
import { toJSON } from '@moxb/moxb';
import { LoginFormUi } from '../form/LoginFormUi';
import { MemTableUi } from '../memtable/MemTableUi';

// helper function to print recursive mobx trees
(window as any).js = function(value: any, ignore = /\b(store|storage)\b/) {
    return toJSON(value, ignore);
};

@inject('app')
@observer
export class ApplicationUi extends React.Component<{ app?: Application }> {
    render() {
        const application = this.props.app;
        return (
            <Container text>
                <Form>
                    <h1>Semantic UI Components</h1>
                    <hr />

                    <h3>ActionButtonUI Component</h3>
                    <ActionButtonUi color="blue" size="large" operation={application!.testAction} />

                    <h3>ActionUI Component</h3>
                    <ActionFormButtonUi color="red" operation={application!.testAction} />

                    <h3>ActionDropdownItemUi Component</h3>
                    <Dropdown item text="Test dropdown">
                        <Dropdown.Menu>
                            <ActionDropdownItemUi operation={application!.testAction} />
                        </Dropdown.Menu>
                    </Dropdown>
                    <br />

                    <h3>BoolUI Component</h3>
                    <BoolUi operation={application!.testBool} />
                    {application!.showCheckbox && (
                        <p>
                            <br />
                            Additional text is visible now!
                        </p>
                    )}
                    <br />

                    <h3>ConfirmUI Component</h3>
                    <ConfirmUi confirm={application!.testConfirm} />
                    <ActionFormButtonUi size="tiny" operation={application!.newConfirmAction()} />
                    <br />

                    <h3>ManyOfUi Component</h3>
                    <div style={{ width: '350px' }}>
                        <ManyOfUi fluid multiple selection operation={application!.testManyOf} />
                    </div>
                    <br />

                    <h3>ModalUi Component</h3>
                    <ActionFormButtonUi size="tiny" color="green" operation={application!.newModalAction()} />
                    <ModalUi modal={application!.testModal}>
                        <TextUi operation={application!.testText} />
                    </ModalUi>
                    <br />

                    <h3>TextUi - Input Component</h3>
                    <TextUi operation={application!.testTextfield} />

                    <h3>TextUi - Textarea Component</h3>
                    <TextUi operation={application!.testTextarea} />
                    <br />

                    <h3>NumericUi Component</h3>
                    <NumericUi operation={application!.testNumeric} />
                    <br />

                    <h3>OneOf - RadioBox Component</h3>
                    <OneOfUi operation={application!.testOfOne} />
                    <br />

                    <h3>OneOf - Select Component</h3>
                    <OneOfSelectUi operation={application!.testOfOne} />
                    <br />

                    <h3>Table Component</h3>
                    <MemTableUi />
                    <br />
                </Form>
                <br />
                <section>
                    <h3>Login Form</h3>
                    <p>
                        Test login is <strong>username:</strong> demo, <strong>password:</strong> demo <br />
                        Other inputs test the error validation.
                    </p>
                    <LoginFormUi />
                </section>
                <div id="spacer" style={{ paddingBottom: '100px' }} />
            </Container>
        );
    }
}
