import { computed, makeObservable } from 'mobx';
import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { Numeric } from './Numeric';

export interface NumericOptions extends ValueOptions<NumericImpl, number> {
    onlyInteger?: boolean;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;

    getMin?(): number;

    getMax?(): number;

    getStep?(): number;

    getUnit?(): string;
}

export class NumericImpl extends ValueImpl<NumericImpl, number, NumericOptions> implements Numeric {
    constructor(impl: NumericOptions) {
        super(impl);
        makeObservable(this);
    }

    @computed
    get onlyInteger() {
        return this.impl.onlyInteger || false;
    }

    @computed
    get min() {
        if (this.impl.getMin) {
            return this.impl.getMin();
        }
        return this.impl.min;
    }

    @computed
    get max() {
        if (this.impl.getMax) {
            return this.impl.getMax();
        }
        return this.impl.max;
    }

    @computed
    get step() {
        if (this.impl.getStep) {
            return this.impl.getStep();
        }
        return this.impl.step;
    }

    @computed
    get unit() {
        if (this.impl.getUnit) {
            return this.impl.getUnit();
        }
        return this.impl.unit;
    }
}
