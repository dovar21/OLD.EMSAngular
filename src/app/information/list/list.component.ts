import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateUpdateUsefulLinkComponent } from '../create-update-useful-link/create-update-useful-link.component';
import { fade } from 'src/app/animations/all';
import { NewsAndInfoService, Item, FetchCriterias } from '../information.service';
import { isEmptyObject, componentDestroyed } from 'src/app/modules/common/utils';
import { CreateUpdateFileArchiveComponent } from '../create-update-file-archive/create-update-file-archive.component';
import { AppComponent } from 'src/app/app.component';
import { PerfectScrollbarConfig } from 'ngx-perfect-scrollbar';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'information-list',
    templateUrl: './list.component.html',
    animations: [fade]
})
export class NewsAndUsefulLinksListComponent implements OnInit, OnDestroy {
    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Page title.
     */
    title = this.route.snapshot.data['title'];

    /**
     * Name of entity ('News' | 'UsefulLink' | 'File')
     */
    controllerName: string;

    /**
     * Determind if all items were fetched.
     */
    totalCountReached: boolean;

    /**
     * Requested entity items with pagination.
     */
    posts: Item[] = [];

    /**
     * Granted permissions.
     */
    permissions = this.app.grantedPermissions;

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Ngx-perfect-scrollbar config.
     */
    perfectScrollBarConfig: PerfectScrollbarConfig = {
        suppressScrollX: true,
        assign: () => {}
    };

    /**
     * Current page number.
     */
    currentPageNumber: number = 1;

    // -------------------------------------------------------------------------
    // Private properties
    // -------------------------------------------------------------------------

    /**
     * Current filter param.
     */
    private currentQueryParams: FetchCriterias = {};

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private dialog: MatDialog,
                private route: ActivatedRoute,
                private service: NewsAndInfoService,
                private router: Router,
                private app: AppComponent) {
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        // Get initial fetch criterias from URL query params if user navigated from filtered link
        this.controllerName = this.route.snapshot.data.controllerName;

        // Fetch data on every URL query params change
        this.route.queryParams
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(params => {
                this.getList(params, 'replace');
                this.currentQueryParams = params;
        });
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Open MatDialog with entity creation component.
     */
    openCreateUpdateDialog(id?: number) {
        let createUpdateComponent: any = CreateUpdateUsefulLinkComponent;

        if (this.controllerName === 'File') createUpdateComponent = CreateUpdateFileArchiveComponent;

        const dialogRef = this.dialog.open(createUpdateComponent, {
            data: { id, controllerName: this.controllerName }
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(result => {
                if (result === 'entityCreated') this.getList({}, 'replace');
            });
    }

    /**
     * Set filter query params.
     * @param event Object with fetch criterias.
     */
    setFilterQueryParams(event: FetchCriterias) {
        if (isEmptyObject(event)) this.resetFilter();
        else {
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: event
            });
        }
    }

    /**
     * Reset filter
     */
    resetFilter() {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {}
        });
    }

    /**
     * Set selected paginator options as query params
     * @param event Event triggered by changing pagination options
     */
    setPaginationQueryParams() {
        if (!this.totalCountReached) {
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {
                    page: this.route.snapshot.queryParams.page ? +this.route.snapshot.queryParams.page + 1 : 2
                },
                queryParamsHandling: 'merge'
            });
        }
    }

    /**
     * Load more to list.
     */
    loadMore() {
        if (!this.totalCountReached) this.getList({ ...this.currentQueryParams, page: ++this.currentPageNumber });
    }

    // -------------------------------------------------------------------------
    // Private methods
    // -------------------------------------------------------------------------

    /**
     * Get entity items with pagination.
     * @param fetchCriterias Filter values.
     * @param addMethod Determines the add to list tactics (push | replace).
     */
    private getList(fetchCriterias?: FetchCriterias, addMethod: string = 'push') {
        this.isRequesting = true;
        this.service
            .getList(this.controllerName, fetchCriterias)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    if (addMethod === 'push') this.posts.push(...response.data.items);
                    else this.posts = response.data.items;

                    this.posts.length >= response.data.totalCount
                        ? (this.totalCountReached = true)
                        : (this.totalCountReached = false);
                },
                error => (this.isRequesting = false),
                () => (this.isRequesting = false)
            );
    }
}
