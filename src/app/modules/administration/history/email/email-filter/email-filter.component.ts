import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { fade } from 'src/app/animations/all';
import { FetchCriterias } from '../email.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment-timezone';

export interface FilterData {
    receiverName?: string;
    receiverEmail?: string;
    fromDate?: string;
    toDate?: string;
}

@Component({
    selector: 'email-filter',
    templateUrl: './email-filter.component.html',
    styleUrls: ['./email-filter.component.sass'],
    animations: [fade]
})
export class EmailFilterComponent implements OnInit, OnDestroy {

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Filter form.
     */
    form: FormGroup;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(@Inject(MAT_BOTTOM_SHEET_DATA) bottomSheet: string,
                private _bottomSheetRef: MatBottomSheetRef<EmailFilterComponent>,
                private snackbar: MatSnackBar,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private router: Router) {
        this.form = this.fb.group({
            receiverName: null,
            receiverEmail: null,
            fromDate: null,
            toDate: null
        });
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        Object.keys(this.route.snapshot.queryParams).forEach(key => {
            this.form.get(key).patchValue(this.route.snapshot.queryParams[key]);
            this.form.get(key).markAsDirty();
        });
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Emit filter criterias up
     */
    submitFilter(isReset?: boolean) {
        if (isReset) {
            this.form.reset();
            return false;
        }

        if (this.form.pristine || !this.form.value) {
            this.snackbar.open('Установите параметры фильтрации.');

            return false;
        }

        const criterias: FetchCriterias = { ...this.form.value };

        Object.keys(this.form.value).forEach(key => {
            if (key === 'fromDate' || key === 'toDate') {
                // @ts-ignore
                criterias[key] = moment(criterias[key]).toDateString();
            }

            if (this.form.get(key).pristine || this.form.get(key).value == '') delete criterias[key];
        });

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: criterias
        });

        this._bottomSheetRef.dismiss();
    }
}
