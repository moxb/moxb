import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { Rate } from './Rate';
import { computed, makeObservable } from 'mobx';

export interface RateOptions extends ValueOptions<RateImpl, number> {
    count?: number;
    allowClear?: boolean;
    allowHalf?: boolean;
    tooltips?: string[];
    showValueLabel?: boolean;
}

export class RateImpl extends ValueImpl<RateImpl, number, RateOptions> implements Rate {
    constructor(impl: RateOptions) {
        super(impl);
        makeObservable(this);
    }

    @computed
    get count() {
        return this.impl.count || 5;
    }

    @computed
    get allowClear() {
        return this.impl.allowClear || false;
    }

    @computed
    get allowHalf() {
        return this.impl.allowHalf || false;
    }

    @computed
    get tooltips() {
        return this.impl.tooltips || [];
    }

    @computed
    get showValueLabel() {
        return this.impl.showValueLabel || false;
    }
}
