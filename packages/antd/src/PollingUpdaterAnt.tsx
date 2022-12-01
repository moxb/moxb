import * as React from 'react';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Popover, Spin, Alert } from 'antd';
import { t } from '@moxb/util';
import { renderUIFragment, UIFragment } from '@moxb/react-html';

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
export const PollingUpdaterAnt = observer((props: PollingUpdaterProps) => {
    const [pending, setPending] = useState(false);
    const [content, setContent] = useState<UIFragment | undefined>();
    const [failed, setFailed] = useState(false);
    const [alive, setAlive] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [lastUpdate, setLastUpdate] = useState<number | undefined>();
    const [updateText, setUpdateText] = useState<string | undefined>();

    let polling: any;
    let counter: any;

    const { operation } = props;

    const update = () => {
        setPending(true);
        setLastUpdate(Date.now());
        operation.update((newErrorMessage, newContent) => {
            setPending(false);
            setErrorMessage(newErrorMessage);
            setFailed(!!newErrorMessage);
            setContent(newContent);
        });
    };

    useEffect(() => {
        if (alive) {
            return;
        }
        /**
         * Start the polling and time counter
         */
        const { updateFrequency } = operation;
        setAlive(true);
        update();
        polling = setInterval(() => update(), updateFrequency * 1000);
        counter = setInterval(() => {
            const age = lastUpdate ? Math.round((Date.now() - lastUpdate) / 1000) : undefined;
            setUpdateText(
                age !== undefined
                    ? t(
                          'pollingUpdater.updateAge.text',
                          'Updated {{age}} seconds ago. Next update in {{left}} seconds.',
                          { age, left: updateFrequency - age }
                      )
                    : t('pollingUpdater.neverLoaded', 'Never loaded.')
            );
        }, 1000);
        /**
         * Stop the polling and time counter
         */
        return () => {
            if (alive) {
                return;
            }
            clearInterval(polling);
            clearInterval(counter);
        };
    }, []);

    const { title, noPopup, noUpdateOnClick } = operation;

    const coreContent = failed ? (
        <Alert message={errorMessage} type={'warning'} />
    ) : (
        <span onClick={noUpdateOnClick ? undefined : update}>
            {renderUIFragment(content)} {pending && <Spin />}
        </span>
    );
    const clickText = noUpdateOnClick
        ? undefined
        : lastUpdate
        ? t('pollingUpdater.clickToUpdate', 'Click to update now.')
        : t('pollingUpdater.clickToLoad', 'Click to load.');
    return noPopup ? (
        coreContent
    ) : (
        <Popover
            content={
                <span>
                    {updateText} {clickText}
                </span>
            }
            title={title}
            trigger="hover"
        >
            {coreContent}
        </Popover>
    );
});
