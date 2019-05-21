import * as React from 'react';
import { Popover, Spin, Alert } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { t } from '@moxb/moxb';
import { renderUIFragment, UIFragment } from './not-antd';

/**
 * A callback type that will be passed to the update function
 */
export type PollingUpdaterCallback = (errorMessage: string | undefined, content: UIFragment | undefined) => void;

interface PollingUpdaterImpl {
    /**
     * How many seconds between the updates?
     */
    readonly updateFrequency: number;

    /**
     * Don't show the pop-up window, with information about update times. (Default: false - show the popup)
     */
    noPopup?: boolean;

    /**
     * Disable for mechanism for for triggering an update by clicking. (Default: false - updates are enabled)
     */
    noUpdateOnClick?: boolean;

    /**
     * What should be in the title, when the popup is shown?
     */
    title: string;

    /**
     * This will be called to trigger an update
     */
    update(callback: PollingUpdaterCallback): void;
}

interface PollingUpdaterProps {
    operation: PollingUpdaterImpl;
}

/**
 * The PollingUpdaterAnt component displays some content that is periodically updated.
 *
 * The rate of updates (polling frequency) is configurable.
 * There is a pop-up, which explains how much time is left till the next update.
 * Immediate update is also possible, when clicking on the content.
 */
@observer
export class PollingUpdaterAnt extends React.Component<PollingUpdaterProps> {
    @observable protected _pending = false;
    @observable protected _content: UIFragment | undefined;
    @observable protected _failed = false;
    @observable protected _errorMessage: string | undefined;
    @observable protected _lastUpdate: number | undefined;
    @observable protected _updateText: string | undefined;

    protected _alive = false;
    protected _polling: any;
    protected _counter: any;

    protected _update() {
        this._pending = true;
        this._lastUpdate = Date.now();
        this.props.operation.update((errorMessage, content) => {
            this._pending = false;
            this._errorMessage = errorMessage;
            this._failed = !!errorMessage;
            this._content = content;
        });
    }

    /**
     * Start the polling and time counter
     */
    protected _awaken() {
        if (this._alive) {
            return;
        }
        const { updateFrequency } = this.props.operation;
        this._alive = true;
        this._update();
        this._polling = setInterval(() => this._update(), updateFrequency * 1000);
        this._counter = setInterval(() => {
            const age = this._lastUpdate ? Math.round((Date.now() - this._lastUpdate) / 1000) : undefined;
            this._updateText =
                age !== undefined
                    ? t(
                          'pollingUpdater.updateAge.text',
                          'Updated {{age}} seconds ago. Next update in {{left}} seconds.',
                          { age, left: updateFrequency - age }
                      )
                    : t('pollingUpdater.neverLoaded', 'Never loaded.');
        }, 1000);
    }

    /**
     * Stop the polling and time counter
     * @private
     */
    protected _ignore() {
        if (!this._alive) {
            return false;
        }
        this._alive = false;
        clearInterval(this._polling);
        clearInterval(this._counter);
    }

    constructor(props: PollingUpdaterProps) {
        super(props);
        this._update = this._update.bind(this);
    }

    render() {
        const { operation } = this.props;
        const { title, noPopup, noUpdateOnClick } = operation;

        const coreContent = this._failed ? (
            <Alert message={this._errorMessage} type={'warning'} />
        ) : (
            <span onClick={noUpdateOnClick ? undefined : this._update}>
                {renderUIFragment(this._content)} {this._pending && <Spin />}
            </span>
        );
        const clickText = noUpdateOnClick
            ? undefined
            : this._lastUpdate
            ? t('pollingUpdater.clickToUpdate', 'Click to update now.')
            : t('pollingUpdater.clickToLoad', 'Click to load.');
        return noPopup ? (
            coreContent
        ) : (
            <Popover
                content={
                    <span>
                        {this._updateText} {clickText}
                    </span>
                }
                title={title}
                trigger="hover"
            >
                {coreContent}
            </Popover>
        );
    }

    componentDidMount() {
        this._awaken();
    }

    componentWillUnmount() {
        this._ignore();
    }
}
