import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatSnackBar } from '@angular/material';
import { AdministrationEmployeeFetchCriterias } from '../administration-employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { fade } from 'src/app/animations/all';
import {
    Department,
    DictionaryDepartmentsService
} from '../../../dictionary/dictionary-departments/dictionary-departments.service';

export interface FilterData {
    fullName?: string;
    departmentId?: number;
    onlyUsers?: boolean;
}

@Component({
    selector: 'administration-employee-filter',
    templateUrl: './administration-employee-filter.component.html',
    styleUrls: ['./administration-employee-filter.component.sass'],
    animations: [fade]
})
export class AdministrationEmployeeFilterComponent implements OnInit, OnDestroy {

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * List of dictionary-departments for selectbox
     */
    departments: Department[];

    /**
     * Register form and it's controls
     */
    form = new FormGroup({
        fullName: new FormControl(null),
        departmentId: new FormControl(null),
        onlyUsers: new FormControl(null)
    });

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(@Inject(MAT_BOTTOM_SHEET_DATA)
                public data: any,
                private _bottomSheetRef: MatBottomSheetRef<AdministrationEmployeeFilterComponent>,
                private departmentsService: DictionaryDepartmentsService,
                private snackbar: MatSnackBar,
                private route: ActivatedRoute,
                private router: Router) {
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.departments = this.data;
        this.form.patchValue(this.route.snapshot.queryParams);
    }

    ngOnDestroy() { }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Emit filter criterias up
     */
    submitFilter(isReset?: boolean) {
        if (this.form.pristine && (!this.route.snapshot.queryParams.fullName && !this.route.snapshot.queryParams.onlyUsers)) {
            this.snackbar.open('Установите параметры фильтрации');
            return false;
        }

        if (isReset) {
            this.form.reset();
            return;
        }

        const criterias: AdministrationEmployeeFetchCriterias = this.form.value;


        if (!criterias.fullName) delete criterias.fullName;
        if (criterias.onlyUsers === false) delete criterias.onlyUsers;

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: criterias
        });

        this._bottomSheetRef.dismiss();
    }
}
