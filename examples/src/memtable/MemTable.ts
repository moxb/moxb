import * as moxb from '@moxb/moxb';

export interface MemTableData {
    readonly id: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly joined: Date;
}

export type ClickHandler = (data: any) => void;

export interface MemTable {
    readonly rows: moxb.Numeric;
    readonly table: moxb.Table<MemTableData>;
    groupId: string;
    objectId: string;
    getHandler(object: string): ClickHandler;
    readonly hasSelection: boolean;
    readonly item: moxb.OneOf;
}
