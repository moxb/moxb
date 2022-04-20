import { action, makeObservable } from 'mobx';
import { MeteorDataFetcherDone } from './MeteorDataFetcher';
import { MeteorTableData, MeteorTableQuery } from './MeteorTableFetcher';
import { MethodDataFetcherImpl } from './MethodDataFetcherImpl';

export class MeteorTableFetcherImpl<T> extends MethodDataFetcherImpl<MeteorTableQuery, MeteorTableData<T>> {
    constructor(
        private readonly _fetchData: (query: MeteorTableQuery, done: MeteorDataFetcherDone<MeteorTableData<T>>) => void
    ) {
        super();

        makeObservable(this, {
            callFetchData: action.bound
        });
    }
    getInitialData() {
        return { totalCount: 0, data: [] };
    }
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
