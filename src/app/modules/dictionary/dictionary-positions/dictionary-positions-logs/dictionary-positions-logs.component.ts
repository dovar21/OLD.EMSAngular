import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fade} from 'src/app/animations/all';
import {MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/modules/common/utils';
import {DictionaryPositionsFetchCriterias, DictionaryPositionsService} from '../dictionary-positions.service';

@Component({
    selector: 'dictionary-positions-logs',
    templateUrl: './dictionary-positions-logs.component.html',
    styleUrls: ['./dictionary-positions-logs.component.sass'],
    animations: [fade]
})
export class DictionaryPositionsLogsComponent implements OnInit, OnDestroy {

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Object of criterias collected from paginator and filter
     * to be sent to API.
     */
    fetchCriterias: DictionaryPositionsFetchCriterias;

    /**
     * Columns to display in the table.
     */
    displayedColumns: string[] = ['name', 'isActive', 'editDate', 'editor'];

    /**
     * Number of dictionary-positions to show on one page.
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
     * Total number of dictionary-positions in DB.
     */
    logTotalCount: number;

    /**
     * AdministrationEmployeeLog values ID.
     */
    id: number;

    /**
     * En event that fires when user interacts with MatPaginator.
     * Contains paginator controls' values.
     */
    pageEvent: PageEvent;

    /**
     * DictionaryPositions in the shape of MatTableDataSource.
     */
    logPositions = new MatTableDataSource();

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

    constructor(private service: DictionaryPositionsService,
                private route: ActivatedRoute,
                private router: Router
    ) {}

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.route.paramMap.pipe(takeUntil(componentDestroyed(this))).subscribe(params => (this.id = +params.get('id')));

        // Get initial fetch criterias from URL query params if user navigated from filtered link
        this.fetchCriterias = this.route.snapshot.queryParams;

        // Set paginator values if department navigated from paginated link
        this.pageIndex = +this.route.snapshot.queryParams.page - 1;
        this.pageSize = +this.route.snapshot.queryParams.pageSize;

        // Fetch data on every URL query params change
        this.route.queryParams.pipe(takeUntil(componentDestroyed(this))).subscribe(params => {
            if (params.constructor === Object && Object.keys(params).length !== 0) {
                this.getPositionsLogs(params);
                this.exportCriterias = params;
            } else this.getPositionsLogs();
        });
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // Private methods
    // -------------------------------------------------------------------------

    /**
     * Send search criterias to positionsService and get dictionary-positions
     * list in return
     * @param criterias Fetch criterias for DB searching
     */
    private getPositionsLogs(criterias?: DictionaryPositionsFetchCriterias) {
        this.isRequesting = true;

        this.service
            .getDictionaryPositionsLogs(this.id, criterias)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.logPositions = response.data.items;
                    this.logTotalCount = response.data.totalCount;
                },
                (error: Response) => (this.isRequesting = false),
                () => {
                    this.isRequesting = false;
                    this.logPositions.paginator = this.paginator;
                    this.logPositions.sort = this.sort;
                }
            );
    }
}
