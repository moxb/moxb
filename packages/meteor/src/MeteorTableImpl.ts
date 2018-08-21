import { SortColumn, t, extractErrorString, toId, TableImpl, TableOptions, TablePaginationImpl } from '@moxb/moxb';
import { Mongo } from 'meteor/mongo';
import { MeteorDataFetcherDone } from './MeteorDataFetcher';
import { MeteorTableData, MeteorTableFetcher, MeteorTableQuery } from './MeteorTableFetcher';
import { MeteorTableFetcherImpl } from './MeteorTableFetcherImpl';

function sortToMongo(sort: SortColumn[]): Mongo.SortSpecifier {
    // tslint:disable-next-line:no-inferred-empty-object-type
    return sort.reduce((p, c) => ({ ...p, ...{ [c.column]: c.sortDirection === 'ascending' ? 1 : -1 } }), {});
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// we remove a few fields that we implement directly
export interface MeteorTableOptions<T> extends Omit<TableOptions<T>, 'data' | 'ready' | 'pagination'> {
    fetchData(query: MeteorTableQuery, done: MeteorDataFetcherDone<MeteorTableData<T>>): void;
    noPagination?: boolean;
}

/**
 * This is heavy expression stuff looking really ugly -- may need some rework!
 */
export class MeteorTableImpl<T> extends TableImpl<T> {
    private readonly meteorImpl: MeteorTableOptions<T>;
    constructor(impl: MeteorTableOptions<T>) {
        // here we implement everything that we can implement
        super({
            ...impl,
            ...{ data: () => this.tableFetcher.data.data },
            ready: () => this.tableFetcher.dataReady,
            pagination: impl.noPagination // we do not add pagination, if the noPagination option is given
                ? undefined
                : new TablePaginationImpl({
                      totalAmount: () => this.tableFetcher.data.totalCount,
                  }),
        } as any);
        this.meteorImpl = impl;
        this.tableFetcher.setDataFetcher(done => {
            let paginationFilterOptions = {};
            if (this.pagination) {
                paginationFilterOptions = this.pagination.filterOptions;
            }
            const query = {
                queryString: this.search ? this.search.query || '' : '',
                options: {
                    sort: sortToMongo(this.sort.sort),
                    ...paginationFilterOptions,
                },
            };

            this.tableFetcher.callFetchData(query, done);
        });
    }
    getData() {
        return this.tableFetcher.data.data;
    }
    private readonly tableFetcher: MeteorTableFetcher<T> = new MeteorTableFetcherImpl((query, done) =>
        this.meteorImpl.fetchData(query, done)
    );
    getError() {
        if (this.tableFetcher.data.error) {
            const error = extractErrorString(this.tableFetcher.data.error);
            return t(toId(this.id + '.serverError.' + error), error);
        }
        return super.getError();
    }
}
