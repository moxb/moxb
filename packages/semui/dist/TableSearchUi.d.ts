import { TableSearch } from '@moxb/moxb';
import * as React from 'react';
export interface BindTableSearchUiProps {
    search: TableSearch;
    style?: {};
    noAlignment?: boolean;
}
export declare class TableSearchUi extends React.Component<BindTableSearchUiProps> {
    render(): JSX.Element;
}
