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
import { DictionaryTareFetchCriterias, DictionaryTareService } from '../dictionary-tare.service';
import { DictionaryTareCreateUpdateComponent } from '../dictionary-tare-create-update/dictionary-tare-create-update.component';
import { DictionaryTareFilterComponent } from '../dictionary-tare-filter/dictionary-tare-filter.component';
import { AppComponent } from '../../../../app.component';

@Component({
    selector: 'dictionary-tare-list-component',
    templateUrl: './dictionary-tare-list.component.html',
    styleUrls: ['./dictionary-tare-list.component.sass'],
    animations: [fade]
})
export class DictionaryTareListComponent implements OnInit, OnDestroy {

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Granted permissions
     */
    permissions = this.app.grantedPermissions;

    /**
     * Current URL.
     */
    currentUrl = this.router.url;

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * DictionaryTare values
     */
    tareArray = new MatTableDataSource();

    /**
     * Total number of dictionary-tare in DB.
     */
    totalCount: number;

    /**
     * Columns to display in the table.
     */
    displayedColumns: string[] = ['name', 'isActive', 'lastModifiedAt', 'lastModifiedAuthor'];

    /**
     * An array of numbers to show on one page.
     */
    pageSizeOptions = [20, 50, 100];

    /**
     * Page number.
     */
    pageIndex: number;

    /**
     * Number of dictionary-tare to show on one page.
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
    fetchCriterias: DictionaryTareFetchCriterias;

    // -------------------------------------------------------------------------
    // ViewChild
    // -------------------------------------------------------------------------

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private bottomSheet: MatBottomSheet,
                private service: DictionaryTareService,
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private app: AppComponent,
                private router: Router
    ) {}

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        if (this.permissions['Tare.Details'] || this.permissions['Tare.Edit'])
            this.displayedColumns.push('actions');

        // Get initial fetch criterias from URL query params if user navigated from filtered link
        this.fetchCriterias = this.route.snapshot.queryParams;

        // Set paginator values if dictionary-tare navigated from paginated link
        this.pageIndex = +this.route.snapshot.queryParams.page - 1;
        this.pageSize = +this.route.snapshot.queryParams.pageSize;

        // Fetch data on every URL query params change
        this.route.queryParams
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(params => {
                if (params.constructor === Object && Object.keys(params).length !== 0) {
                    this.getTare(params);
                } else this.getTare();
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
        this.bottomSheet.open(DictionaryTareFilterComponent);
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
        const dialogRef = this.dialog.open(DictionaryTareCreateUpdateComponent, {
            data: { id, name }
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(result => {
                if (result === 'submit') this.getTare();
            });
    }

    // -------------------------------------------------------------------------
    // Private methods
    // -------------------------------------------------------------------------

    /**
     * Send search criterias to tareService and get dictionary-tare
     * list in return
     * @param criterias Fetch criterias for DB searching
     */
    private getTare(criterias?: DictionaryTareFetchCriterias) {
        this.isRequesting = true;

        this.service
            .getList(criterias)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.tareArray = response.data.items;
                this.totalCount = response.data.totalCount
            },
            (error: Response) => (this.isRequesting = false),
            () => {
                this.isRequesting = false;
                this.tareArray.paginator = this.paginator;
                this.tareArray.sort = this.sort;
            });
    }
}
