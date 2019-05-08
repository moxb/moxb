import { LocationManager, TokenManager, TokenManagerImpl, LinkGenerator, LinkGeneratorImpl } from '@moxb/moxb';
import { Application } from '../app/Application';
import { ApplicationImpl } from '../app/ApplicationImpl';
import { MemTable } from '../memtable/MemTable';
import { MemTableImpl } from '../memtable/MemTableImpl';
import { LocationStoreImpl } from './LocationStoreImpl';
import { UrlStore } from './UrlStore';
import { UrlStoreImpl } from './UrlStoreImpl';
import { ViewStore } from './ViewStore';
import { ViewStoreImpl } from './ViewStoreImpl';
import { mainMenu } from '../MenuStructure';

export interface Store {
    readonly app: Application;
    readonly memTable: MemTable;
    readonly view: ViewStore;
    readonly locationManager: LocationManager;
    readonly tokenManager: TokenManager;
    readonly url: UrlStore;
    readonly linkGenerator: LinkGenerator;
}

export class StoreImpl implements Store {
    readonly app: Application;
    readonly memTable: MemTable;
    readonly view: ViewStore;
    readonly locationManager: LocationManager;
    readonly tokenManager: TokenManager;
    readonly url: UrlStore;
    readonly linkGenerator: LinkGenerator;

    constructor() {
        this.locationManager = new LocationStoreImpl();
        this.tokenManager = new TokenManagerImpl(this.locationManager);
        this.url = new UrlStoreImpl(this.locationManager, this.tokenManager);
        this.app = new ApplicationImpl();
        this.memTable = new MemTableImpl(this.url, this.tokenManager);
        this.view = new ViewStoreImpl();
        this.linkGenerator = new LinkGeneratorImpl({
            locationManager: this.locationManager,
            states: mainMenu,
            rootUrl: 'https://localhost:3100',
        });
    }
}
