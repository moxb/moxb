import {
    ActionButtonAnt,
    ActionFormButtonAnt,
    ActionSpanAnt,
    BoolAnt,
    BoolSwitchAnt,
    ConfirmAnt,
    DatePickerAnt,
    LabelAnt,
    LabelMarkdownAnt,
    ManyOfAnt,
    ManyOfCheckboxAnt,
    ManyOfSwitchAnt,
    ModalAnt,
    NumericFormAnt,
    OneOfAnt,
    OneOfButtonFormAnt,
    OneOfSelectAnt,
    ProgressFormAnt,
    RateFormAnt,
    TableAnt,
    TagAnt,
    TextAnt,
    TextFormAnt,
    TimePickerAnt,
    TreeAnt,
    ActionToggleButtonAnt,
    ToolTipButton,
    PollingUpdaterAnt,
    SliderFormAnt,
    OneOfSearchableSelectAnt,
} from '@moxb/antd';
import { toJSON } from '@moxb/moxb';
import { Col, Dropdown, Form, Menu, Row } from 'antd';
import DownOutlined from '@ant-design/icons/DownOutlined';

import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { CountingClock } from '@moxb/react-html';
import { useStore } from '../store/Store';

// helper function to print recursive mobx trees
(window as any).js = function (value: any, ignore = /\b(store|storage)\b/) {
    return toJSON(value, ignore);
};

export const ApplicationAnt = observer(() => {
    const [creation, setCreation] = useState(0);

    useEffect(() => setCreation(Date.now()), []);

    const { app: application } = useStore();

    return (
        <Row>
            <Col span={16}>
                <section
                    style={{
                        border: '1px solid #ebedf0',
                        padding: '42px 24px 50px',
                        color: 'rgba(0,0,0,.65)',
                    }}
                >
                    <Form>
                        <h1>Ant design Components</h1>
                        <hr />
                        <LabelMarkdownAnt operation={application.testLabelMarkdown} />
                        <LabelAnt operation={application.testLabel} />
                        <ActionButtonAnt
                            id="application.test.impl.testButton1"
                            type="primary"
                            operation={application.testAction}
                        />
                        <br />
                        <br />
                        <h3>ActionFormButtonUI Component</h3>
                        <ActionFormButtonAnt type="primary" operation={application.testAction} />
                        <br />
                        <br />
                        <h3>ActionToggleButtonUI Component</h3>
                        <ActionToggleButtonAnt
                            id="application.test.impl.toggleButton"
                            backgroundColor="#FFFFFF"
                            labelColor="#003f54"
                            operation={application.testBool}
                        />
                        <h3>TooltipButton Component</h3>
                        <ToolTipButton type="primary" operation={application.testAction} text={'Label'} />
                        <br />
                        <br />
                        <br />
                        <br />
                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item>1st menu item</Menu.Item>
                                    <Menu.Item>
                                        <ActionSpanAnt operation={application.testAction} />
                                    </Menu.Item>
                                </Menu>
                            }
                        >
                            <a className="ant-dropdown-link" href="#">
                                Dropdown menu <DownOutlined />
                            </a>
                        </Dropdown>
                        <br />
                        <br />
                        <h3>BoolUI Component</h3>
                        <BoolAnt operation={application.testBool} />
                        <br />
                        <BoolSwitchAnt operation={application.testBool} />
                        {application.showCheckbox && (
                            <p>
                                <br />
                                Additional text is visible now!
                            </p>
                        )}
                        <br />
                        <h3>ConfirmUI Component</h3>
                        <ConfirmAnt operation={application.testConfirm} />
                        <ActionButtonAnt operation={application.newConfirmAction()} />
                        <br />
                        <br />
                        <h3>ModalAnt Component</h3>
                        <ActionButtonAnt color="green" operation={application.newModalAction()} />
                        <ModalAnt operation={application.testModal}>
                            <TextFormAnt operation={application.testText} />
                        </ModalAnt>
                        <br />
                        <br />
                        <h3>TextAnt - Input Component</h3>
                        <TextAnt id={application.testTextField + '-1'} operation={application.testTextField} />
                        <br />
                        <br />
                        <h3>TextAnt - Password Input Component</h3>
                        <TextAnt type="password" operation={application.testTextField} />
                        <br />
                        <br />
                        <h3>TextAnt - Textarea Component</h3>
                        <TextAnt operation={application.testTextarea} />
                        <br />
                        <br />
                        <h3>NumericAnt Component</h3>
                        <NumericFormAnt operation={application.testNumeric} />
                        <br />
                        <h3>RateAnt Component</h3>
                        <div style={{ backgroundColor: 'white' }}>
                            <RateFormAnt operation={application.testRate} />
                        </div>
                        <br />
                        <h3>SliderAnt Component</h3>
                        <SliderFormAnt operation={application.testSliderNumeric} showNumber={true} />
                        <br />
                        <h3>ProgressAnt Component</h3>
                        <ProgressFormAnt operation={application.testProgress} />
                        <ActionButtonAnt operation={application.decreaseLineProgress} />
                        <ActionButtonAnt operation={application.increaseLineProgress} />
                        <br />
                        <br />
                        <ProgressFormAnt operation={application.testProgress2} />
                        <ActionButtonAnt operation={application.decreaseCircleProgress} />
                        <ActionButtonAnt operation={application.increaseCircleProgress} />
                        <br />
                        <br />
                        <h3>TagAnt Component</h3>
                        <TagAnt operation={application.testTags} tagColor="#87d068" newItemLabel={'tstst'} />
                        <br />
                        <br />
                        <h3>ManyOfAnt Component</h3>
                        <ManyOfAnt style={{ width: '200px' }} operation={application.testManyOf} />
                        <br />
                        <br />
                        <h3>ManyOfAnt Component - choose from available</h3>
                        <ManyOfAnt style={{ width: '200px' }} mode="multiple" operation={application.testManyOf} />
                        <br />
                        <br />
                        <h3>ManyOfCheckAnt Component - multiple selection with checkboxes</h3>
                        <ManyOfCheckboxAnt style={{ width: '200px' }} operation={application.testManyOf} />
                        <br />
                        <br />
                        <h3>ManyOfSwitchAnt Component - multiple selection with switches</h3>
                        <ManyOfSwitchAnt operation={application.testManyOf} />
                        <br />
                        <br />
                        <h3>ManyOfSwitchAnt Component - multiple selection with switches - vertical</h3>
                        <ManyOfSwitchAnt operation={application.testManyOf} vertical={true} />
                        <br />
                        <br />
                        <h3>OneOf - RadioButton Component</h3>
                        <h4>Default layout:</h4>
                        <OneOfAnt operation={application.testOfOne} />
                        <br />
                        <h4>Vertical layout:</h4>
                        <OneOfAnt operation={application.testOfOne} vertical={true} />
                        <br />
                        <br />
                        <h3>OneOf - RadioButton solid Component</h3>
                        <OneOfButtonFormAnt buttonStyle="solid" operation={application.testOfOne} />
                        <br />
                        <br /> <h3>OneOf - Select Component</h3>
                        <OneOfSelectAnt operation={application.testOfOne} style={{ width: '200px' }} />
                        <br />
                        <br /> <h3>OneOf - Select searchable Component</h3>
                        <OneOfSearchableSelectAnt operation={application.testOfOne} style={{ width: '100%' }} />
                        <br />
                        <br />
                        <br /> <h3>Tree Component</h3>
                        <TreeAnt operation={application.testTree} />
                        <br />
                        <span>Tree selection: {application.testTreeSelection}</span>
                        <br />
                        <h3>DatePicker Component</h3>
                        <DatePickerAnt operation={application.testDate} />
                        <br />
                        <br />
                        <h3>TimePicker Component</h3>
                        <TimePickerAnt operation={application.testTime} />
                        <br />
                        <br />
                        <hr />
                        <h3>Table Component</h3>
                        <TableAnt table={application.testTable} />
                        <br />
                        <br />
                        <PollingUpdaterAnt
                            operation={{
                                updateFrequency: 5,
                                title: 'Time watcher',
                                update: (callback) => {
                                    // A fake/demo update function, which checks the time
                                    callback(undefined, `Latest time is: ${new Date().toString()}`);
                                },
                            }}
                        />
                        <br />
                        <br />
                        <h3>Counting Clock widget</h3>
                        <ul>
                            <li>
                                For a fixed amount of time: <CountingClock fixedAmount={95} id={'fixed-clock'} />
                            </li>
                            <li>
                                Counting forward: <CountingClock measureSince={creation} id={'forward-clock'} />
                            </li>
                            <li>
                                Countdown: <CountingClock countdownTo={creation + 300000} id={'countdown-clock'} />
                            </li>
                        </ul>
                        <br />
                        <br />
                        <div id="spacer" style={{ paddingBottom: '100px' }} />
                    </Form>
                </section>
            </Col>
        </Row>
    );
});
