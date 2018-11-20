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
import { TokenManager, TokenManagerImpl } from '../../../packages/moxb/src/routing';
import { mainMenu } from '../MenuStructure';

export interface Store {
    readonly app: Application;
    readonly memTable: MemTable;
    readonly view: ViewStore;
    readonly locationManager: LocationManager;
    readonly tokens: TokenManager;
    readonly url: UrlStore;
}

export class StoreImpl implements Store {
    readonly app: Application;
    readonly memTable: MemTable;
    readonly view: ViewStore;
    readonly locationManager: LocationManager;
    readonly tokens: TokenManager;
    readonly url: UrlStore;

    constructor() {
        this.locationManager = new LocationStoreImpl();
        this.tokens = new TokenManagerImpl({
            locationManager: this.locationManager,
            subStates: mainMenu,
        });
        this.url = new UrlStoreImpl(this.locationManager, this.tokens);
        this.app = new ApplicationImpl();
        this.memTable = new MemTableImpl(this.url);
        this.view = new ViewStoreImpl();
    }
}
