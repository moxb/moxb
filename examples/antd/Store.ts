import { Application } from './Application';
import { ApplicationImpl } from './ApplicationImpl';
import { MemTable } from './memtable/MemTable';
import { MemTableImpl } from './memtable/MemTableImpl';

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
