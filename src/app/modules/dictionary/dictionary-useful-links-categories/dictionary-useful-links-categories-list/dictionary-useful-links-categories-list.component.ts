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
import { DictionaryUsefulLinksCategoriesFetchCriterias, DictionaryUsefulLinksCategoriesService } from '../dictionary-useful-links-categories.service';
import { DictionaryUsefulLinksCategoriesCreateUpdateComponent } from '../dictionary-useful-links-categories-create-update/dictionary-useful-links-categories-create-update.component';
import { DictionaryUsefulLinksCategoriesFilterComponent } from '../dictionary-useful-links-categories-filter/dictionary-useful-links-categories-filter.component';
import { AppComponent } from '../../../../app.component';

@Component({
    selector: 'dictionary-useful-links-categories-list-component',
    templateUrl: './dictionary-useful-links-categories-list.component.html',
    styleUrls: ['./dictionary-useful-links-categories-list.component.sass'],
    animations: [fade]
})
export class DictionaryUsefulLinksCategoriesListComponent implements OnInit, OnDestroy {

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
     * UsefulLinksCategories values
     */
    usefulLinksCategories = new MatTableDataSource();

    /**
     * Total number of usefulLinksCategories in DB.
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
     * Number of usefulLinksCategories to show on one page.
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
    fetchCriterias: DictionaryUsefulLinksCategoriesFetchCriterias;

    // -------------------------------------------------------------------------
    // ViewChild
    // -------------------------------------------------------------------------

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private service: DictionaryUsefulLinksCategoriesService,
                private bottomSheet: MatBottomSheet,
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private app: AppComponent,
                private router: Router
    ) {}

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        if (this.permissions['UsefulLinkCategories.Details'] || this.permissions['UsefulLinkCategories.Edit'])
            this.displayedColumns.push('actions');

        // Get initial fetch criterias from URL query params if user navigated from filtered link
        this.fetchCriterias = this.route.snapshot.queryParams;

        // Set paginator values if usefulLinksCategories navigated from paginated link
        this.pageIndex = +this.route.snapshot.queryParams.page - 1;
        this.pageSize = +this.route.snapshot.queryParams.pageSize;

        // Fetch data on every URL query params change
        this.route.queryParams.pipe(takeUntil(componentDestroyed(this))).subscribe(params => {
            if (params.constructor === Object && Object.keys(params).length !== 0) {
                this.getUsefulLinksCategories(params);
            } else this.getUsefulLinksCategories();
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
        this.bottomSheet.open(DictionaryUsefulLinksCategoriesFilterComponent);
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
        const dialogRef = this.dialog.open(DictionaryUsefulLinksCategoriesCreateUpdateComponent, {
            data: { id, name }
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(result => {
                if (result === 'submit') this.getUsefulLinksCategories();
            });
    }

    // -------------------------------------------------------------------------
    // Private methods
    // -------------------------------------------------------------------------

    /**
     * Send search criterias to usefulLinksCategoriesService and get usefulLinksCategories
     * list in return
     * @param criterias Fetch criterias for DB searching
     */
    private getUsefulLinksCategories(criterias?: DictionaryUsefulLinksCategoriesFetchCriterias) {
        this.isRequesting = true;

        this.service
            .getList(criterias)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.usefulLinksCategories = response.data.items;
                this.totalCount = response.data.totalCount
            },
            (error: Response) => (this.isRequesting = false),
            () => {
                this.isRequesting = false;
                this.usefulLinksCategories.paginator = this.paginator;
                this.usefulLinksCategories.sort = this.sort;
            });
    }
}
