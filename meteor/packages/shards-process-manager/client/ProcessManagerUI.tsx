import * as React from 'react';
import { useState } from 'react';
import { Button, Spin, Table, Progress as ProgressBar, Row, Col, Input, Popconfirm, Checkbox, Alert } from 'antd';
import { CheckOutlined, SyncOutlined } from '@ant-design/icons';

import { CountingClock, highlightedText } from '@moxb/react-html';
import { useMeteorPublication } from '@moxb/meteor-react';

import type { ProcessRecord, ProcessState, ProcessStatus, ProgressStatus } from '../api/types';
import {
    dismissProcessMessagesMethod,
    launchProcessMethod,
    publicationBackgroundProcesses,
    purgeProcesses,
    stopProcessMethod,
} from '../api/controller';
import './process-manager.css';

interface ProcessTableUIProps {
    scopeId: string;
    processes: ProcessRecord[];
    search: string;
    ready: boolean;
    error: string | undefined;
}

type ProgressBarStatus = 'success' | 'normal' | 'active' | 'exception';

const getProgressBarState = (status?: ProcessStatus): ProgressBarStatus => {
    if (!status?.state) {
        return 'normal';
    }
    switch (status.state) {
        case 'failed':
            return 'exception';
        case 'idle':
        case 'stopped':
            return 'normal';
        case 'scheduled':
        case 'running':
        case 'stopRequested':
        case 'stopping':
            return 'active';
        case 'done':
            return 'success';
        default:
            console.log('Unknown state', status.state);
            return 'normal';
    }
};

function formatTime(time: Date | undefined): string {
    return time ? time.toLocaleTimeString() : '(missing time)';
}

/**
 * Pad numbers with a 0 if necessary.
 *
 * (ie. 8 -> "08")
 */
const padNumber = (x: number) => {
    const int = Math.floor(x);
    return int < 10 ? '0' + int : '' + int;
};

/**
 * Format seconds as a clock.
 *
 * (ie. 80 -> 01:20)
 */
const formatDuration = (secs: number | undefined) =>
    secs === undefined
        ? 'missing time'
        : secs > 3600
        ? padNumber(secs / 3600) + ':' + padNumber((secs % 3600) / 60) + ':' + padNumber(secs % 60)
        : padNumber(secs / 60) + ':' + padNumber(secs % 60);

const getProgressBarMessage = (status: ProcessStatus | undefined, progress: ProgressStatus) => {
    if (!status?.state) {
        return '';
    }
    switch (status.state) {
        case 'failed':
            return `${status.error} at ${formatTime(status.failedAt!)}`;
        case 'idle':
            return '';
        case 'stopped':
            return `Stopped at ${formatTime(status.stoppedAt!)}`;
        case 'scheduled':
            return 'Scheduled ...';
        case 'running':
            return (
                <span>
                    {status.runningSince && <CountingClock measureSince={status.runningSince.getTime()} />}
                    &nbsp;
                    {progress.message}
                </span>
            );
        case 'stopRequested':
        case 'stopping':
            return (
                <span>
                    {status.runningSince && <CountingClock measureSince={status.runningSince.getTime()} />}
                    &nbsp;
                    {progress.message} <span className={'stopping-flag'}>(stopping)</span>
                </span>
            );
        case 'done':
            return `Finished at ${formatTime(status.doneAt)}, in ${formatDuration(status.duration)}.`;
    }
};

const activeStates: ProcessState[] = ['scheduled', 'running', 'stopRequested', 'stopping', 'stopped', 'failed'];
const isStateActive = (state?: ProcessState) => (state ? activeStates.includes(state) : false);

function ProcessTableRawUI(props: ProcessTableUIProps) {
    const { scopeId, processes, search, error } = props;
    if (error) {
        return <Alert type={'error'} message={error} />;
    }
    return (
        <Table
            dataSource={processes}
            rowKey={'_id'}
            columns={[
                {
                    title: '',
                    dataIndex: 'status',
                    width: '20%',
                    render: (status: ProcessStatus = { state: 'idle' }, process: ProcessRecord) => {
                        const { state } = status;
                        const { processId, warning, special } = process;
                        const run = () =>
                            launchProcessMethod.call({ scopeId, processId }, (error, _result) => {
                                if (error) {
                                    console.log('Error:', (error as any).error || error.message);
                                }
                            });

                        const isStopping = ['stopRequested', 'stopping'].includes(state);

                        return (
                            <>
                                {warning ? (
                                    <Popconfirm title={warning} onConfirm={run} okText="Yes" cancelText="No">
                                        <Button
                                            danger
                                            disabled={['scheduled', 'running', 'stopRequested', 'stopping'].includes(
                                                state
                                            )}
                                        >
                                            Run
                                        </Button>
                                    </Popconfirm>
                                ) : (
                                    <Button
                                        type={special ? 'default' : 'primary'}
                                        onClick={run}
                                        disabled={['scheduled', 'running', 'stopRequested', 'stopping'].includes(state)}
                                    >
                                        Run
                                    </Button>
                                )}

                                {['scheduled', 'running', 'stopRequested', 'stopping'].includes(state) && (
                                    <Button
                                        disabled={isStopping}
                                        onClick={() => stopProcessMethod.call({ scopeId, processId })}
                                    >
                                        Stop
                                        {isStopping && <Spin />}
                                    </Button>
                                )}
                            </>
                        );
                    },
                },
                {
                    dataIndex: 'name',
                    title: 'Topic',
                    width: '40%',
                    render: (name) => highlightedText(name, search),
                },
                {
                    dataIndex: 'special',
                    title: 'Special?',
                    width: '5%',
                    render: (value) => (value ? <CheckOutlined /> : null),
                },
                {
                    dataIndex: 'detailLevel',
                    title: 'Detail level',
                    width: '5%',
                    // render: (value) => (value ? <CheckOutlined /> : null),
                },
                {
                    title: 'Progress',
                    dataIndex: 'progress',
                    render: (progress: ProgressStatus = { message: '', rate: 0 }, process) => {
                        const { processId } = process;
                        const myStatus = getProgressBarState(process.status);
                        const myMessage = getProgressBarMessage(process.status, progress);
                        const state = process.status?.state || 'wtf';
                        return (
                            <>
                                {['scheduled', 'running', 'stopRequested', 'stopping'].includes(state) && (
                                    <SyncOutlined spin style={{ marginRight: '1em' }} />
                                )}

                                {myMessage}
                                <ProgressBar percent={Math.round(progress.rate * 100)} status={myStatus} />
                                {['failed', 'stopped'].includes(state) && (
                                    <Button onClick={() => dismissProcessMessagesMethod.call({ scopeId, processId })}>
                                        Dismiss
                                    </Button>
                                )}
                            </>
                        );
                    },
                },
            ]}
        />
    );
}

const ProcessTableUI = React.memo(ProcessTableRawUI, (_, props) => !props.ready);

export function ProcessManagerUI(props: { scopeId: string }) {
    const { scopeId } = props;
    const [search, setSearch] = useState('');
    const [focusOnActive, setFocusOnActive] = useState(true);
    const [hideDetails, setHideDetails] = useState(true);
    const [hideSpecial, setHideSpecial] = useState(true);
    const [localError, setLocalError] = useState<string | undefined>();

    const [areProcessesLoading, processes, processError] = useMeteorPublication(
        publicationBackgroundProcesses,
        {
            scopeId,
            search,
        },
        'ProcessManagerUI'
    );

    const hasActive = processes.some((p) => isStateActive(p.status?.state));
    const shownProcesses = processes.filter(
        (p) =>
            isStateActive(p.status?.state) || // always show active
            ((!hideDetails || p.detailLevel === 1) && // hide details if required
                (!hideSpecial || !p.special) && // hide special if requested
                (!hasActive || !focusOnActive)) // hide inactive if required
    );
    return (
        <>
            <Row>
                <Col span={4}>Search for process:</Col>
                <Col>
                    <Input.Search
                        placeholder=""
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        style={{ width: 200 }}
                    />
                    {areProcessesLoading() && <Spin />}
                </Col>
                <Col>
                    <Checkbox checked={focusOnActive} onChange={(v) => setFocusOnActive(v.target.checked)}>
                        Focus on active
                    </Checkbox>
                </Col>
                <Col>
                    <Checkbox checked={hideDetails} onChange={(v) => setHideDetails(v.target.checked)}>
                        Hide details
                    </Checkbox>
                </Col>
                <Col>
                    <Checkbox checked={hideSpecial} onChange={(v) => setHideSpecial(v.target.checked)}>
                        Hide special
                    </Checkbox>
                </Col>
            </Row>
            <ProcessTableUI
                scopeId={scopeId}
                processes={shownProcesses}
                search={search}
                ready={!areProcessesLoading()}
                error={localError || processError}
            />
            <Button
                danger
                onClick={() =>
                    purgeProcesses
                        .callPromise(scopeId)
                        .catch((error) => setLocalError("Can't reset processes: " + error.message))
                }
            >
                Reset processes
            </Button>
        </>
    );
}
