import * as React from 'react';
export interface CountingClockProps {
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
interface ClockState {
    display: string;
}
/**
 * This widget can display an amount of time, like a clock.
 *
 * It can count forward, it can count backwards, and in can also show a fixed amount of time.
 */
export declare class CountingClock extends React.Component<CountingClockProps, ClockState> {
    constructor(props: CountingClockProps);
    private update;
    private timerId;
    private get shouldRun();
    private get isRunning();
    private startOrStopAndUpdate;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): JSX.Element | null;
}
export {};
