import { Application } from '../app/Application';
import { ApplicationImpl } from '../app/ApplicationImpl';
import { MemTable } from '../memtable/MemTable';
import { MemTableImpl } from '../memtable/MemTableImpl';
import { ViewStore } from './ViewStore';
import { ViewStoreImpl } from './ViewStoreImpl';
import { LocationManager } from '@moxb/moxb';
import { LocationStoreImpl } from './LocationStoreImpl';

export interface Store {
    readonly app: Application;
    readonly memTable: MemTable;
    readonly view: ViewStore;
    readonly location: LocationManager;
}

export class StoreImpl implements Store {
    readonly app: Application;
    readonly memTable: MemTable;
    readonly view: ViewStore;
    readonly location: LocationManager;

    constructor() {
        this.app = new ApplicationImpl();
        this.memTable = new MemTableImpl();
        this.view = new ViewStoreImpl();
        this.location = new LocationStoreImpl();
    }
}
