import * as moxb from '@moxb/moxb';
import { MemTable, MemTableData } from './MemTable';
import { computed } from 'mobx';

const firstNames = [
    'James',
    'Mary',
    'John',
    'Patricia',
    'Robert',
    'Jennifer',
    'Michael',
    'Linda',
    'William',
    'Elizabeth',
    'David',
    'Barbara',
    'Richard',
    'Susan',
    'Joseph',
    'Jessica',
    'Thomas',
    'Sarah',
    'Charles',
    'Margaret',
];
const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Jones',
    'Brown',
    'Davis',
    'Miller',
    'Wilson',
    'Moore',
    'Taylor',
    'Anderson',
    'Thomas',
    'Jackson',
    'White',
    'Harris',
    'Martin',
    'Thompson',
    'Garcia',
    'Martinez',
    'Robinson',
    'Clark',
    'Rodriguez',
    'Lewis',
    'Lee',
    'Walker',
    'Hall',
    'Allen',
    'Young',
    'Hernandez',
    'King',
    'Wright',
    'Lopez',
    'Hill',
];
const emails = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'aol.com',
    'msn.com',
    'ymail.com',
    'outlook.com',
    'rocketmail.com',
];

function createData(n: number): MemTableData[] {
    const result: MemTableData[] = [];
    const today = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    for (let i = 0; i < n; i++) {
        const id = 'user' + i;
        const firstName = firstNames[i % firstNames.length];
        const lastName = lastNames[i % lastNames.length];
        const email = `${firstName}${i}@${emails[i % emails.length]}`;
        const joined = new Date(today - i * 30200 * 1000);
        result.push({ id, email, firstName, lastName, joined });
    }
    return result;
}

function sort(data: any[], sortOrder: moxb.SortColumn[]) {
    if (sortOrder.length) {
        data.sort((a, b) => {
            for (let i = 0; i < sortOrder.length; i++) {
                const order = sortOrder[i];
                const mul = order.sortDirection === 'descending' ? 1 : -1;
                const x = a[order.column];
                const y = b[order.column];
                if (x < y) {
                    return mul;
                }
                if (x > y) {
                    return -mul;
                }
            }
            return 0;
        });
    }
}

export class MemTableImpl implements MemTable {
    readonly rows: moxb.Numeric = new moxb.NumericImpl({
        id: 'memtable.rows',
        label: 'Number of rows',
        initialValue: 10,
    });
    readonly table = new moxb.TableImpl<MemTableData>({
        id: 'memtable.table',
        columns: table => [
            new moxb.TableColumnImpl(
                {
                    id: 'email',
                    label: 'E-Mail',
                },
                table
            ),
            new moxb.TableColumnImpl(
                {
                    id: 'firstName',
                    label: 'First Name',
                    preferredSortDirection: 'ascending',
                },
                table
            ),
            new moxb.TableColumnImpl(
                {
                    id: 'lastName',
                    label: 'Last Name',
                    preferredSortDirection: 'ascending',
                },
                table
            ),
            new moxb.TableColumnImpl(
                {
                    id: 'joined',
                    label: 'Joined',
                    preferredSortDirection: 'descending',
                },
                table
            ),
        ],
        data: () => this.data,
        search: new moxb.TableSearchImpl(),
        pagination: new moxb.TablePaginationImpl({
            totalAmount: () => this.filteredData.length,
        }),
    });
    @computed
    get data() {
        const data = [...this.filteredData];
        sort(data, this.table.sort.sort);
        return this.getCurrentPage(data);
    }
    private get filteredData() {
        return this.filter(this.rawData);
    }
    @computed
    private get rawData() {
        return createData(this.rows.value || 0);
    }
    private filter(data: MemTableData[]): MemTableData[] {
        if (this.table.search && this.table.search.query) {
            //simple algorithm: seach for each query independently
            const queries = this.table.search.query.split(/\s+/);
            const fields = this.table.columns.map(c => c.column);
            for (const query of queries) {
                // we treat the fields as strings and check if the value is included
                data = data.filter((d: any) => fields.findIndex(f => (d[f] + '').includes(query)) >= 0);
            }
            return data;
        } else {
            return data;
        }
    }

    private getCurrentPage(data: MemTableData[]): MemTableData[] {
        if (this.table.pagination) {
            const fo = this.table.pagination.filterOptions;
            if (fo.skip != null && fo.limit != null) {
                return data.slice(fo.skip, fo.skip + fo.limit);
            }
        }
        return data;
    }
}
