import { t, TablePagination } from '@moxb/moxb';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Dropdown, Pagination } from 'semantic-ui-react';

export interface BindTablePaginationUiProps {
    pagination: TablePagination;
    noAlignment?: boolean;
}

export const TablePaginationUi = observer((props: BindTablePaginationUiProps) => {
    const { pagination, noAlignment, ...paginationProps } = props;
    const options = pagination.pageSizes.map((value) => ({ key: value, text: '' + value, value }));
    if (!pagination.visible) {
        return null;
    }
    return (
        <div className={noAlignment ? undefined : 'container ui'} style={{ marginTop: '20px' }}>
            <Pagination
                onPageChange={(_event, data) => pagination.setActivePage(data.activePage as number)}
                activePage={pagination.activePage}
                totalPages={pagination.totalPages}
                firstItem={{
                    'aria-label': t('TablePaginationUi.buttons.firstItem', 'First item'),
                    content: '«',
                    disabled: !pagination.hasPrevPage,
                }}
                prevItem={{
                    'aria-label': t('TablePaginationUi.buttons.previousItem', 'Previous item'),
                    content: '⟨',
                    disabled: !pagination.hasPrevPage,
                }}
                lastItem={{
                    'aria-label': t('TablePaginationUi.buttons.lastItem', 'Last item'),
                    content: '»',
                    disabled: !pagination.hasNextPage,
                }}
                nextItem={{
                    'aria-label': t('TablePaginationUi.buttons.nextItem', 'Next item'),
                    content: '⟩',
                    disabled: !pagination.hasNextPage,
                }}
                {...paginationProps}
            />
            <span style={{ marginLeft: '10px' }}>
                {t('TablePaginationUi.dropdown.show', 'Show')}
                <Dropdown
                    item
                    simple
                    value={pagination.pageSize}
                    onChange={(_event, data) => pagination.setPageSize(data.value as number)}
                    style={{ margin: '0 10px' }}
                    options={options}
                />
            </span>
            {t('TablePaginationUi.dropdown.entries', 'entries')}
        </div>
    );
});
