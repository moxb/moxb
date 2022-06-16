import * as moxb from '@moxb/moxb';
import * as React from 'react';
import { TableProps } from 'semantic-ui-react';
export interface TableUiProps extends TableProps {
    table: moxb.Table<any>;
    hideHeader?: boolean;
}
export declare class TableUi extends React.Component<TableUiProps> {
    render(): JSX.Element;
}
