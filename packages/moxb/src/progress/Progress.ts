import { Value } from '../value/Value';

export interface Progress extends Value<number> {
    formatPercent?: (percent?: number, successPercent?: number) => React.ReactNode;
    status?: 'success' | 'exception' | 'normal' | 'active';
    success?: {
        percent: number;
        strokeColor?: string;
    };
    trailColor?: string;
    type?: 'line' | 'circle' | 'dashboard';
    steps?: number;

    strokeColor?: string | { from: string; to: string; direction: string };
    strokeLinecap?: 'round' | 'square';
    strokeWidth?: number;

    width?: number;
    gapDegree?: number;
    gapPosition?: 'top' | 'bottom' | 'left' | 'right';
}
