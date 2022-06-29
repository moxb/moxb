import { action, makeObservable } from 'mobx';
import type { MeteorDataFetcherDone } from './MeteorDataFetcher';
import type { MeteorTableData, MeteorTableQuery } from './MeteorTableFetcher';
import { MethodDataFetcherImpl } from './MethodDataFetcherImpl';

export class MeteorTableFetcherImpl<T> extends MethodDataFetcherImpl<MeteorTableQuery, MeteorTableData<T>> {
    constructor(
        private readonly _fetchData: (query: MeteorTableQuery, done: MeteorDataFetcherDone<MeteorTableData<T>>) => void
    ) {
        super();
        makeObservable(this);
    }
    getInitialData() {
        return { totalCount: 0, data: [] };
    }
    @action.bound
    callFetchData(query: MeteorTableQuery, done: MeteorDataFetcherDone<MeteorTableData<T>>): void {
        this._fetchData(query, (error, data) => {
            // if there is an error, we set the error in the data
            if (error) {
                done(error, { error, ...this.getInitialData() });
            } else {
                done(error, data);
            }
        });
    }
}
