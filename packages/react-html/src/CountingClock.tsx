import * as React from 'react';
import { useEffect, useState } from 'react';

export interface CountingClockProps {
    // ========== You should only provide one of the three parameters ===============================

    /**
     * An optional ID for this clock. (Useful for debugging)
     */
    id?: string;

    /**
     * Measure the time elapsed since this point of time
     */
    measureSince?: number;

    /**
     * Measure the time remaining until this point of time
     */
    countdownTo?: number;

    /**
     * Show this amount of time
     */
    fixedAmount?: number;

    // ======= You should only provide one of the above three parameters ====================

    /**
     * Any extra classes to add
     */
    classNames?: string;

    /**
     * CSS Style
     */
    style?: React.CSSProperties;

    /**
     * Do we want to do some extra post-processing on the formatted string?
     */
    postFormatter?: (s: string) => string;

    /**
     * Help text to display while hoovering.
     */
    help?: string;
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
const formatSecs = (secs: number) =>
    secs > 3600
        ? padNumber(secs / 3600) + ':' + padNumber((secs % 3600) / 60) + ':' + padNumber(secs % 60)
        : padNumber(secs / 60) + ':' + padNumber(secs % 60);

/**
 * This widget can display an amount of time, like a clock.
 *
 * It can count forward, it can count backwards, and in can also show a fixed amount of time.
 */
export const CountingClock = (props: CountingClockProps) => {
    const [display, setDisplay] = useState('');
    const { measureSince, countdownTo, fixedAmount, classNames = '', style = {}, help } = props;

    function update() {
        let formatted: string;
        const { postFormatter } = props;
        if (measureSince) {
            formatted = formatSecs((Date.now() - measureSince) / 1000);
        } else if (countdownTo) {
            const remaining = (countdownTo - Date.now()) / 1000;
            formatted = remaining > 0 ? formatSecs(remaining) : '';
        } else if (fixedAmount) {
            formatted = formatSecs(fixedAmount);
        } else {
            formatted = '';
        }
        if (postFormatter && !!formatted) {
            formatted = postFormatter(formatted);
        }
        if (display !== formatted) {
            setDisplay(formatted);
        }
    }

    let timerId: any;

    const shouldRun = !!measureSince || !!countdownTo;

    useEffect(() => {
        if (timerId) {
            clearInterval(timerId);
            timerId = undefined;
        }
        update();
        if (shouldRun) {
            timerId = setInterval(() => update(), 1000);
        }
        return () => {
            if (timerId) {
                clearInterval(timerId);
            }
        };
    }, [measureSince, countdownTo, shouldRun]);

    let present = 0;
    if (measureSince) {
        present++;
    }
    if (countdownTo) {
        present++;
    }
    if (fixedAmount) {
        present++;
    }
    if (present > 1) {
        throw new Error(
            'You should never provide more than one of the three multiple exclusionary input args: countdownTo, measureSince, fixedAmount'
        );
    }
    return present ? (
        <span style={style} className={'clockCounter ' + classNames} title={help}>
            {display}
        </span>
    ) : null;
};
