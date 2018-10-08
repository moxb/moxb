import { Application } from './Application';
import { ApplicationImpl } from './ApplicationImpl';
import { MemTable } from '../memtable/MemTable';
import { MemTableImpl } from '../memtable/MemTableImpl';
import { ViewStore } from './ViewStore';
import { ViewStoreImpl } from './ViewStoreImpl';

export interface Store {
    readonly app: Application;
    readonly memTable: MemTable;
    readonly view: ViewStore;
}

export class StoreImpl implements Store {
    readonly app: Application;
    readonly memTable: MemTable;
    readonly view: ViewStore;
    constructor() {
        this.app = new ApplicationImpl();
        this.memTable = new MemTableImpl();
        this.view = new ViewStoreImpl();
    }
}
