import { TablePagination } from '@moxb/moxb';
import * as React from 'react';
export interface BindTablePaginationUiProps {
    pagination: TablePagination;
    noAlignment?: boolean;
}
export declare class TablePaginationUi extends React.Component<BindTablePaginationUiProps> {
    render(): JSX.Element | null;
}
