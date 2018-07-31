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

export class MemTableImpl implements MemTable {
    readonly rows: moxb.Numeric = new moxb.NumericImpl({
        id: 'memtable.rows',
        initialValue: 10,
    });
    readonly table = new moxb.TableImpl<MemTableData>({
        id: 'memtable.table',
        columns: table => [
            new moxb.TableColumnImpl(
                {
                    id: 'emails',
                    label: 'E-Mail',
                    preferredSortDirection: 'ascending',
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
                    id: 'createdAt',
                    label: 'Joined',
                    preferredSortDirection: 'descending',
                },
                table
            ),
        ],
        data: () => createData(this.rows.value || 0),
    });
}
