import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
    MatBottomSheet,
    MatDialog,
    MatPaginator,
    MatSort,
    MatTableDataSource,
    PageEvent,
    Sort
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { fade } from 'src/app/animations/all';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';
import {
    DictionaryProductClassificationCodesFetchCriterias,
    DictionaryProductClassificationCodesService
} from '../dictionary-products-classification-codes.service';
import { DictionaryProductsClassificationCodesCreateUpdateComponent } from '../dictionary-products-classification-codes-create-update/dictionary-products-classification-codes-create-update.component';
import { DictionaryProductsClassificationCodesFilterComponent } from '../dictionary-products-classification-codes-filter/dictionary-products-classification-codes-filter.component';

@Component({
    selector: 'dictionary-products-classification-codes-list-component',
    templateUrl: './dictionary-products-classification-codes-list.component.html',
    styleUrls: ['./dictionary-products-classification-codes-list.component.sass'],
    animations: [fade]
})
export class DictionaryProductsClassificationCodesListComponent implements OnInit, OnDestroy {

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Current URL.
     */
    currentUrl = this.router.url;

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * ProductsClassificationCodes values
     */
    productsClassificationCodes = new MatTableDataSource();

    /**
     * Total number of productsClassificationCodes in DB.
     */
    totalCount: number;

    /**
     * Columns to display in the table.
     */
    displayedColumns: string[] = ['name', 'isActive', 'lastModifiedAt', 'lastModifiedAuthor', 'actions'];

    /**
     * An array of numbers to show on one page.
     */
    pageSizeOptions = [20, 50, 100];

    /**
     * Page number.
     */
    pageIndex: number;

    /**
     * Number of productsClassificationCodes to show on one page.
     */
    pageSize: number;

    /**
     * En event that fires when user interacts with MatPaginator.
     * Contains paginator controls' values.
     */
    pageEvent: PageEvent;

    /**
     * Object of criterias collected from paginator and filter
     * to be sent to API.
     */
    fetchCriterias: DictionaryProductClassificationCodesFetchCriterias;

    // -------------------------------------------------------------------------
    // ViewChild
    // -------------------------------------------------------------------------

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private bottomSheet: MatBottomSheet,
        private service: DictionaryProductClassificationCodesService,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private router: Router
    ) { }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        // Get initial fetch criterias from URL query params if user navigated from filtered link
        this.fetchCriterias = this.route.snapshot.queryParams;

        // Set paginator values if productClassificationCode navigated from paginated link
        this.pageIndex = +this.route.snapshot.queryParams.page - 1;
        this.pageSize = +this.route.snapshot.queryParams.pageSize;

        // Fetch data on every URL query params change
        this.route.queryParams
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(params => {
                if (params.constructor === Object && Object.keys(params).length !== 0) {
                    this.getProductClassificationCodes(params);
                } else this.getProductClassificationCodes();
            });
    }

    ngOnDestroy() { }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Open filter component
     */
    openBottomSheet(): void {
        this.bottomSheet.open(DictionaryProductsClassificationCodesFilterComponent);
    }

    /**
     * Set selected paginator options as query params
     * @param event Event triggered by changing pagination options
     */
    setPaginationQueryParams(event: PageEvent) {
        const { pageIndex, pageSize } = event;

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                page: pageIndex + 1, // TODO: Configure MatPaginator pageIndex to start from 1
                pageSize
            },
            queryParamsHandling: 'merge'
        });
    }

    /**
     * Set query params based on sorting values.
     * @param event Standard MatSort event.
     */
    setSortingQueryParams(event: Sort) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { sortProperty: event.active, sortDir: event.direction },
            queryParamsHandling: 'merge'
        });
    }

    /**
     * Create or update dictionary sub-values
     * @param id sub-dictionary ID
     * @param name sub-dictionary name
     */
    openDialogUpdate(id?: number, name?: string): void {
        const dialogRef = this.dialog.open(DictionaryProductsClassificationCodesCreateUpdateComponent, {
            data: { id, name }
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(result => {
                if (result === 'submit') this.getProductClassificationCodes();
            });
    }

    // -------------------------------------------------------------------------
    // Private methods
    // -------------------------------------------------------------------------

    /**
     * Send search criterias to productsClassificationCodesService and get productsClassificationCodes
     * list in return
     * @param criterias Fetch criterias for DB searching
     */
    private getProductClassificationCodes(criterias?: DictionaryProductClassificationCodesFetchCriterias) {
        this.isRequesting = true;

        this.service
            .getList(criterias)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.productsClassificationCodes = response.data.items;
                    this.totalCount = response.data.totalCount
                },
                (error: Response) => (this.isRequesting = false),
                () => {
                    this.isRequesting = false;
                    this.productsClassificationCodes.paginator = this.paginator;
                    this.productsClassificationCodes.sort = this.sort;
                }
            );
    }
}
