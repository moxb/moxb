import { Application } from './Application';
import { ApplicationImpl } from './ApplicationImpl';

export interface Store {
    readonly app:Application;
}

export class StoreImpl implements Store {
    readonly app: Application;
    constructor() {
        this.app = new ApplicationImpl();
    }
}
