import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fade} from 'src/app/animations/all';
import {MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/modules/common/utils';
import {DictionaryCountriesFetchCriterias, DictionaryCountriesService} from '../dictionary-countries.service';

@Component({
    selector: 'dictionary-countries-logs',
    templateUrl: './dictionary-countries-logs.component.html',
    styleUrls: ['./dictionary-countries-logs.component.sass'],
    animations: [fade]
})
export class DictionaryCountriesLogsComponent implements OnInit, OnDestroy {

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
    fetchCriterias: DictionaryCountriesFetchCriterias;

    /**
     * Columns to display in the table.
     */
    displayedColumns: string[] = ['name', 'isActive', 'editDate', 'editor'];

    /**
     * Number of dictionary-countries to show on one page.
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
     * Total number of dictionary-countries in DB.
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
     * Countries in the shape of MatTableDataSource.
     */
    logCountries = new MatTableDataSource();

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

    constructor(private service: DictionaryCountriesService,
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

        // Set paginator values if country navigated from paginated link
        this.pageIndex = +this.route.snapshot.queryParams.page - 1;
        this.pageSize = +this.route.snapshot.queryParams.pageSize;

        // Fetch data on every URL query params change
        this.route.queryParams.pipe(takeUntil(componentDestroyed(this))).subscribe(params => {
            if (params.constructor === Object && Object.keys(params).length !== 0) {
                this.getCountriesLogs(params);
                this.exportCriterias = params;
            } else this.getCountriesLogs();
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
     * Send search criterias to countriesService and get dictionary-countries
     * list in return
     * @param criterias Fetch criterias for DB searching
     */
    private getCountriesLogs(criterias?: DictionaryCountriesFetchCriterias) {
        this.isRequesting = true;

        this.service
            .getDictionaryCountriesLogs(this.id, criterias)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.logCountries = response.data.items;
                    this.logTotalCount = response.data.totalCount;
                },
                (error: Response) => (this.isRequesting = false),
                () => {
                    this.isRequesting = false;
                    this.logCountries.paginator = this.paginator;
                    this.logCountries.sort = this.sort;
                }
            );
    }
}
