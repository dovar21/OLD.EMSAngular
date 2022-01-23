import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
    AdministrationEmployee,
    AdministrationEmployeeExportCriterias,
    AdministrationEmployeeFetchCriterias,
    AdministrationEmployeeService
} from '../administration-employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet, MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { PAGE_SIZE_OPTIONS } from 'src/app/app.config';
import { detailExpand, fade } from 'src/app/animations/all';
import { AppComponent } from 'src/app/app.component';
import { componentDestroyed, downloadFileFromBlob } from 'src/app/modules/common/utils';
import { switchMap, takeUntil } from 'rxjs/operators';
import { AdministrationEmployeeFilterComponent } from '../administration-employee-filter/administration-employee-filter.component';
import {
    AutocompleteDepartment,
    DictionaryDepartmentsService
} from '../../../dictionary/dictionary-departments/dictionary-departments.service';

@Component({
    selector: 'administration-employee-list',
    templateUrl: './administration-employee-list.component.html',
    styleUrls: ['./administration-employee-list.component.sass'],
    animations: [fade, detailExpand]
})
export class AdministrationEmployeeListComponent implements OnInit, OnDestroy {

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Page title.
     */
    title = this.route.snapshot.data['title'];

    /**
     * Determines whether to show locked administration-employee or active.
     */
    showLocked = this.route.snapshot.data['showLocked'];

    /**
     * Employees in the shape of MatTableDataSource.
     */
    employees: MatTableDataSource<AdministrationEmployee[]>;

    /**
     * An array of columns to display in the table.
     */
    displayedColumns: string[];

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Object of criterias collected from paginator and filter
     * to be sent to API.
     */
    fetchCriterias: AdministrationEmployeeFetchCriterias;

    /**
     * Number of administration-employee to show on one page.
     */
    pageSize: number;

    /**
     * An array of numbers to show on one page.
     */
    pageSizeOptions = PAGE_SIZE_OPTIONS;

    /**
     * Page number.
     */
    pageIndex: number;

    /**
     * Total number of administration-employee in DB.
     */
    employeesCount: number;

    /**
     * En event that fires when user interacts with MatPaginator.
     * Contains paginator controls' values.
     */
    pageEvent: PageEvent;

    /**
     * Granted permissions
     */
    permissions = this.app.grantedPermissions;

    /**
     * Export list params.
     */
    exportCriterias: any;

    /**
     * List of dictionary-brands for selectbox
     */
    departments: AutocompleteDepartment[];

    /**
     * If component load after shown filter
     */
    isComponentLoad: boolean;

    // -------------------------------------------------------------------------
    // ViewChild
    // -------------------------------------------------------------------------

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private bottomSheet: MatBottomSheet,
                private departmentsService: DictionaryDepartmentsService,
                private service: AdministrationEmployeeService,
                private route: ActivatedRoute,
                private router: Router,
                private app: AppComponent) {

    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.departmentsService
            .getDepartmentsSelectItems()
            .pipe(
                takeUntil(componentDestroyed(this)),
                switchMap(response => {
                    if (this.departments && this.departments.length > 0) return;
                    this.departments = response.data;
                    return this.route.queryParams;
                })
            )
            .subscribe(params => {
                // Get initial fetch criterias from URL query params if user navigated from filtered link
                this.fetchCriterias = this.route.snapshot.queryParams;

                // Set paginator values if user navigated from paginated link
                this.pageIndex = +this.route.snapshot.queryParams.page - 1; // TODO: Configure MatPaginator pageIndex to start from 1
                this.pageSize = +this.route.snapshot.queryParams.pageSize;

                this.get(params);

                if (this.showLocked) {
                    this.get({ locked: true });
                    this.displayedColumns = ['fullName', 'department', 'hireDate', 'lockDate', 'lockReason'];
                } else {
                    this.get(this.fetchCriterias);
                    this.displayedColumns = ['photo', 'fullName', 'department', 'hasAccount', 'email'];

                    if (this.permissions['Employees.Details'] || this.permissions['Employees.Update'])
                        this.displayedColumns.push('actions');
                }
                this.isComponentLoad = true;
            });
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Open filter component
     */
    openBottomSheet(): void {
        this.bottomSheet.open(AdministrationEmployeeFilterComponent, { data: this.departments });
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
     * Set query params based on paginator values.
     * @param event Event triggered by changing pagination controls.
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
     * Get administration-employee.
     * @param criterias Optional fetch criterias for DB filtering.
     */
    get(criterias?: AdministrationEmployeeFetchCriterias) {
        this.isRequesting = true;

        if (this.showLocked) criterias = { ...criterias, locked: true };

        this.service
            .get(criterias)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.employees = response.data.items;
                    this.employeesCount = response.data.totalCount;
                },
                (error: Response) => (this.isRequesting = false),
                () => {
                    this.isRequesting = false;
                    this.employees.paginator = this.paginator;
                    this.employees.sort = this.sort;
                }
            );
    }

    /**
     * Set export params.
     * @param event Export params object.
     */
    setExportCriterias(event: AdministrationEmployeeExportCriterias) {
        this.exportCriterias = event;
    }

    /**
     * Send current viewing administration-employee-view list to server and start downloading.
     * of the returned file.
     */
    export() {
        this.isRequesting = true;

        this.service
            .exportCriterias(this.exportCriterias)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    downloadFileFromBlob(response.headers.get('content-disposition'), response.body);
                },
                (error: Response) => (this.isRequesting = false),
                () => (this.isRequesting = false)
            );
    }

    /**
     * Export given administration-employee-view data to file (PDF).
     * @param id AdministrationEmployee ID.
     */
    exportEmployee(id: number) {
        this.isRequesting = true;

        this.service
            .export(id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => downloadFileFromBlob(response.headers.get('content-disposition'), response.body),
                (error: Response) => (this.isRequesting = false),
                () => (this.isRequesting = false)
            );
    }

}
