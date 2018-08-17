import { Application } from './Application';
import { ApplicationImpl } from './ApplicationImpl';
import { MemTable } from './MemTable';
import { MemTableImpl } from './MemTableImpl';

export interface Store {
    readonly app: Application;
    readonly memTable: MemTable;
}

export class StoreImpl implements Store {
    readonly app: Application;
    readonly memTable: MemTable = new MemTableImpl();
    constructor() {
        this.app = new ApplicationImpl();
    }
}
