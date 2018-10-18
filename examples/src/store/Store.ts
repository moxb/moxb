import { LocationManager } from '@moxb/moxb';
import { Application } from '../app/Application';
import { ApplicationImpl } from '../app/ApplicationImpl';
import { MemTable } from '../memtable/MemTable';
import { MemTableImpl } from '../memtable/MemTableImpl';
import { ViewStore } from './ViewStore';
import { ViewStoreImpl } from './ViewStoreImpl';
import { LocationStoreImpl } from './LocationStoreImpl';
import { UrlStore } from './UrlStore';
import { UrlStoreImpl } from './UrlStoreImpl';

export interface Store {
    readonly app: Application;
    readonly memTable: MemTable;
    readonly view: ViewStore;
    readonly locationManager: LocationManager;
    readonly url: UrlStore;
}

export class StoreImpl implements Store {
    readonly app: Application;
    readonly memTable: MemTable;
    readonly view: ViewStore;
    readonly locationManager: LocationManager;
    readonly url: UrlStore;

    constructor() {
        this.locationManager = new LocationStoreImpl();
        this.app = new ApplicationImpl();
        this.memTable = new MemTableImpl();
        this.view = new ViewStoreImpl();
        this.url = new UrlStoreImpl(this.locationManager);
    }
}
