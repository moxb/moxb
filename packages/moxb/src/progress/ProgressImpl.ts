import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { Progress } from './Progress';
import { ValueOrFunction } from '../bind/BindImpl';
import { computed } from 'mobx';

export interface ProgressOptions extends ValueOptions<ProgressImpl, number> {
    formatPercent?: (percent?: number, successPercent?: number) => React.ReactNode;
    status?: ValueOrFunction<'success' | 'exception' | 'normal' | 'active'>;
    success?: ValueOrFunction<{
        percent: number;
        strokeColor?: string;
    }>;
    trailColor?: ValueOrFunction<string>;
    type?: ValueOrFunction<'line' | 'circle' | 'dashboard'>;
    steps?: ValueOrFunction<number>;
    strokeColor?: ValueOrFunction<string | { from: string; to: string; direction: string }>;
    strokeLinecap?: ValueOrFunction<'round' | 'square'>;
    strokeWidth?: ValueOrFunction<number>;
    width?: ValueOrFunction<number>;
    gapDegree?: ValueOrFunction<number>;
    gapPosition?: ValueOrFunction<'top' | 'bottom' | 'left' | 'right'>;
}

export class ProgressImpl extends ValueImpl<ProgressImpl, number, ProgressOptions> implements Progress {
    constructor(impl: ProgressOptions) {
        super(impl);
    }

    private implValOrUndefined(key: string) {
        if ((this.impl as any)[key]) {
            const val = (this.impl as any)[key];
            if (typeof val === 'function') {
                return val();
            } else {
                return val;
            }
        } else {
            return undefined;
        }
    }

    @computed
    get formatPercent() {
        return this.implValOrUndefined('formatPercent');
    }

    @computed
    get success() {
        return this.implValOrUndefined('success');
    }

    @computed
    get trailColor() {
        return this.implValOrUndefined('trailColor');
    }

    @computed
    get type() {
        return this.implValOrUndefined('type');
    }

    @computed
    get steps() {
        return this.implValOrUndefined('steps');
    }

    @computed
    get strokeColor() {
        return this.implValOrUndefined('strokeColor');
    }

    @computed
    get strokeLinecap() {
        return this.implValOrUndefined('strokeLinecap');
    }

    @computed
    get strokeWidth() {
        return this.implValOrUndefined('strokeWidth');
    }

    @computed
    get width() {
        return this.implValOrUndefined('width');
    }

    @computed
    get gapDegree() {
        return this.implValOrUndefined('gapDegree');
    }

    @computed
    get gapPosition() {
        return this.implValOrUndefined('gapPosition');
    }
}
