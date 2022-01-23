import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from '../../../common/utils';
import { AutocompleteDepartment } from '../../../dictionary/dictionary-departments/dictionary-departments.service';

export interface FilteredValue {
    valueName: any;
    valueId?: number;
    valueType: string;
}

@Component({
    selector: 'administration-employee-filter-list',
    templateUrl: './administration-employee-filter-list.component.html',
    styleUrls: ['./administration-employee-filter-list.component.sass'],
})
export class AdministrationEmployeeFilterListComponent implements OnInit, OnDestroy {

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    /**
     * Set productGroups in (ProductsList) module for filter list.
     */
    @Input()
    departments: AutocompleteDepartment[];

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Select filter parameters catteries
     */
    selectFilterCatteries: FilteredValue[];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private route: ActivatedRoute,
                private router: Router) {
    }

    // -------------------------------------------------------------------------
    // Lifecycle callbacks
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.route.queryParams
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(params => {
                this.selectFilterCatteries = [];
                if (params.fullName) this.selectFilterCatteries.push({ valueName: params.fullName, valueType: 'ФИО' });

                if (params.departmentId) {
                    const foundDepartment = this.departments.find(department => department.id === +params.departmentId);
                    this.selectFilterCatteries.push({ valueName: foundDepartment.name, valueId: foundDepartment.id, valueType: 'Отдел' });
                }

                if (params.onlyUsers) this.selectFilterCatteries.push({ valueName: 'Только пользователи', valueType: 'Только пользователи' });
            });
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Remove filter parameter methods and update queryParams.
     */
    removeValue(selectValue: FilteredValue) {
        const params = { ...this.route.snapshot.queryParams };

        switch (selectValue.valueType) {
            case 'ФИО':
                delete params.fullName;
                break;

            case 'Отдел':
                delete params.departmentId;
                break;

            case 'Только пользователи':
                delete params.onlyUsers;
                break;
        }

        this.router.navigate([], { queryParams: params });
    }

}
