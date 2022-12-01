import { computed, makeObservable } from 'mobx';
import { ValueOrFunction } from '@moxb/util';
import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { Progress, ProgressStatus, ProgressType } from './Progress';

export interface ProgressOptions extends ValueOptions<ProgressImpl, number> {
    // The active status of the progress
    status?: ValueOrFunction<ProgressStatus>;
    // Progress type
    type?: ValueOrFunction<ProgressType>;
    // Number of steps for line-type
    steps?: ValueOrFunction<number>;
}

export class ProgressImpl extends ValueImpl<ProgressImpl, number, ProgressOptions> implements Progress {
    constructor(impl: ProgressOptions) {
        super(impl);
        makeObservable(this);
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
    get status() {
        return this.implValOrUndefined('status');
    }
}
