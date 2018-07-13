import { TablePagination } from '../TablePagination';
import { TablePaginationImpl } from '../TablePaginationImpl';

describe('totalPages', function() {
    let totalAmount = 0;
    let bind: TablePagination;
    beforeEach(function() {
        totalAmount = 0;

        bind = new TablePaginationImpl({
            totalAmount() {
                return totalAmount;
            },
        });
        bind.setPageSize(10);
    });

    it('should return 1 by default', function() {
        expect(bind.totalPages).toBe(1);
    });
    it('should return 2 for 11 entries', function() {
        totalAmount = 11;
        expect(bind.totalPages).toBe(2);
    });

    it('should return 1 if pageSize <= 0', function() {
        totalAmount = 100;
        bind.setPageSize(-1);
        expect(bind.totalPages).toBe(1);
        bind.setPageSize(0);
        expect(bind.totalPages).toBe(1);
    });
});

describe('currentPage', function() {
    let totalAmount = 0;
    let bind: TablePagination;
    beforeEach(function() {
        totalAmount = 100;

        bind = new TablePaginationImpl({
            totalAmount() {
                return totalAmount;
            },
        });
        bind.setPageSize(10);
    });

    it('should not become < 1 ', function() {
        bind.setActivePage(-1);
        expect(bind.activePage).toBe(1);
    });

    it('should not become > totalPages', function() {
        bind.setActivePage(200);
        expect(bind.activePage).toBe(bind.totalPages);
    });

    it('should change if setPageSize changes ', function() {
        bind.setActivePage(200);
        expect(bind.activePage).toBe(10);

        bind.setPageSize(300);
        expect(bind.activePage).toBe(bind.totalPages);
        expect(bind.activePage).toBe(1);
    });
});

describe('filterOptions', function() {
    let totalAmount = 0;
    let bind: TablePagination;
    beforeEach(function() {
        totalAmount = 60;

        bind = new TablePaginationImpl({
            totalAmount() {
                return totalAmount;
            },
        });
        bind.setPageSize(10);
    });
    it('should start at 0', function() {
        expect(bind.filterOptions).toEqual({ limit: 10, skip: 0 });
    });
    it('should increment the scrip count when activePage changes', function() {
        bind.setActivePage(4);
        expect(bind.filterOptions).toEqual({ limit: 10, skip: 30 });
    });
    it('should not skip more than the amount', function() {
        bind.setActivePage(50);
        expect(bind.filterOptions).toEqual({ limit: 10, skip: 50 });
    });
    it('should update if totalAmount changes', function() {
        bind.setActivePage(4);
        expect(bind.filterOptions).toEqual({ limit: 10, skip: 30 });
        totalAmount = 15;
        expect(bind.filterOptions).toEqual({ limit: 10, skip: 10 });
    });
    it('should change when page size changes', function() {
        bind.setPageSize(5);
        expect(bind.filterOptions).toEqual({ limit: 5, skip: 0 });
    });
});

describe('hasPrevPage', function() {
    let totalAmount = 0;
    let bind: TablePagination;
    beforeEach(function() {
        totalAmount = 60;

        bind = new TablePaginationImpl({
            totalAmount() {
                return totalAmount;
            },
        });
        bind.setPageSize(10);
    });
    it('should be false at page 1', function() {
        expect(bind.hasPrevPage).toBe(false);
    });

    it('should be true at page 2', function() {
        bind.setActivePage(2);
        expect(bind.hasPrevPage).toBe(true);
    });

    it('should be true at page 1000', function() {
        bind.setActivePage(1000);
        expect(bind.hasPrevPage).toBe(true);
    });
});
describe('hasNextPage', function() {
    let totalAmount = 0;
    let bind: TablePagination;
    beforeEach(function() {
        totalAmount = 60;

        bind = new TablePaginationImpl({
            totalAmount() {
                return totalAmount;
            },
        });
        bind.setPageSize(10);
    });
    it('should be true at page 1', function() {
        expect(bind.hasNextPage).toBe(true);
    });

    it('should be true at page 2', function() {
        bind.setActivePage(2);
        expect(bind.hasNextPage).toBe(true);
    });

    it('should be false at last page', function() {
        bind.setActivePage(bind.totalPages);
        expect(bind.hasNextPage).toBe(false);
    });
});
