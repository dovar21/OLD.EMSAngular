import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { detailExpand, fade } from 'src/app/animations/all';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService, FetchCriterias, Item } from '../email.service';
import { MatBottomSheet, MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';
import { EmailFilterComponent } from '../email-filter/email-filter.component';

@Component({
    selector: 'email-list',
    templateUrl: './email-list.component.html',
    styleUrls: ['./email-list.component.sass'],
    animations: [fade, detailExpand]
})
export class EmailListComponent implements OnInit, OnDestroy {

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Page title.
     */
    title = this.route.snapshot.data['title'];

    /**
     * Name of history ('EmailMessageHistory' | 'SmsHistory' | ...)
     */
    controllerName: string;

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Object of criterias collected from paginator and filter
     * to be sent to API.
     */
    fetchCriterias: FetchCriterias;

    /**
     * Number of email history to show on one page.
     */
    pageSize: number;

    /**
     * An array of numbers to show on one page.
     */
    pageSizeOptions = [20, 50, 100];

    /**
     * Page number.
     */
    pageIndex: number;

    /**
     * Total number of email history in DB.
     */
    historyCount: number;

    /**
     * En event that fires when user interacts with MatPaginator.
     * Contains paginator controls' values.
     */
    pageEvent: PageEvent;

    /**
     * Email history in the shape of MatTableDataSource.
     */
    history = new MatTableDataSource();

    /**
     * Columns to display in the table.
     */
    columnsToDisplay = ['receiverUser', 'receiverEmail', 'subject', 'senderEmail', 'createdAt'];

    /**
     * Currently expanded table row.
     */
    expandedElement: Item | null;

    /**
     * Export list params.
     */
    exportCriterias: any;

    // -------------------------------------------------------------------------
    // ViewChild
    // -------------------------------------------------------------------------

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private bottomSheet: MatBottomSheet,
                private route: ActivatedRoute,
                private service: EmailService,
                private router: Router) {
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        // Get initial fetch criterias from URL query params if user navigated from filtered link
        this.fetchCriterias = this.route.snapshot.queryParams;

        // Set paginator values if email navigated from paginated link
        this.pageIndex = +this.route.snapshot.queryParams.page - 1;
        this.pageSize = +this.route.snapshot.queryParams.pageSize;

        this.controllerName = this.route.snapshot.data.controllerName;

        // Fetch data on every URL query params change
        this.route.queryParams.pipe(takeUntil(componentDestroyed(this))).subscribe(params => {
            if (params.constructor === Object && Object.keys(params).length !== 0) {
                this.getEmailHistory(params);
                this.exportCriterias = params;
            } else this.getEmailHistory();
        });
    }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Open filter component
     */
    openBottomSheet(): void {
        this.bottomSheet.open(EmailFilterComponent);
    }

    /**
     * Set sorting query params
     * @param event Standard MatSort event
     */
    setSortingQueryParams(event: Sort) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { sortProperty: event.active, sortDir: event.direction },
            queryParamsHandling: 'merge'
        });
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
     * Send search criterias to emailService and get email history
     * list in return
     * @param criterias Fetch criterias for DB searching
     */
    private getEmailHistory(criterias?: FetchCriterias) {
        this.isRequesting = true;

        this.service
            .getList(this.controllerName, criterias)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.history = response.data.items;
                    this.historyCount = response.data.totalCount;
                },
                (error: Response) => (this.isRequesting = false),
                () => {
                    this.isRequesting = false;
                    this.history.paginator = this.paginator;
                    this.history.sort = this.sort;
                }
            );
    }

    ngOnDestroy() {}
}
