import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fade} from 'src/app/animations/all';
import {MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/modules/common/utils';
import {DictionaryDepartmentsService, DepartmentsFetchCriterias} from '../dictionary-departments.service';

@Component({
    selector: 'dictionary-departments-logs',
    templateUrl: './dictionary-departments-logs.component.html',
    styleUrls: ['./dictionary-departments-logs.component.sass'],
    animations: [fade]
})
export class DictionaryDepartmentsLogsComponent implements OnInit, OnDestroy {

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Object of criterias collected from paginator and filter
     * to be sent to API.
     */
    fetchCriterias: DepartmentsFetchCriterias;

    /**
     * Columns to display in the table.
     */
    displayedColumns: string[] = ['name', 'isActive', 'editDate', 'editor'];

    /**
     * Number of dictionary-departments to show on one page.
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
     * Total number of dictionary-departments in DB.
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
     * Departments in the shape of MatTableDataSource.
     */
    logDepartments = new MatTableDataSource();

    /**
     * Export list params.
     */
    exportCriterias: any;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private service: DictionaryDepartmentsService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.route.paramMap.pipe(takeUntil(componentDestroyed(this)))
            .subscribe(params => {
                this.id = +params.get('id');
            });

        // Get initial fetch criterias from URL query params if user navigated from filtered link
        this.fetchCriterias = this.route.snapshot.queryParams;

        // Set paginator values if department navigated from paginated link
        this.pageIndex = +this.route.snapshot.queryParams.page - 1;
        this.pageSize = +this.route.snapshot.queryParams.pageSize;

        // Fetch data on every URL query params change
        this.route.queryParams.pipe(takeUntil(componentDestroyed(this))).subscribe(params => {
            if (params.constructor === Object && Object.keys(params).length !== 0) {
                this.getDepartmentsLogs(params);
                this.exportCriterias = params;
            } else this.getDepartmentsLogs();
        });
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
     * Send search criterias to departmentsService and get dictionary-departments
     * list in return
     * @param criterias Fetch criterias for DB searching
     */
    private getDepartmentsLogs(criterias?: DepartmentsFetchCriterias) {
        this.isRequesting = true;

        this.service
            .getDepartmentsLogs(this.id, criterias)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.logDepartments = response.data.items;
                    this.logTotalCount = response.data.totalCount;
                },
                (error: Response) => (this.isRequesting = false),
                () => {
                    this.isRequesting = false;
                    this.logDepartments.paginator = this.paginator;
                    this.logDepartments.sort = this.sort;
                }
            );
    }

    ngOnDestroy() {}
}
