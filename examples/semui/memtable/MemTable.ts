import * as moxb from '@moxb/moxb';

export interface MemTableData {
    readonly id: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly joined: Date;
}

export interface MemTable {
    readonly rows: moxb.Numeric;
    readonly table: moxb.Table<MemTableData>;
}
