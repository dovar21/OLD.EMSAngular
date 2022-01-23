import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatSnackBar } from '@angular/material';
import { fade } from 'src/app/animations/all';
import { DictionaryNationalitiesFetchCriterias } from '../dictionary-nationalities.service';

export interface FilterData {
    name?: string;
    onlyActive?: boolean;
}

@Component({
    selector: 'dictionary-nationalities-filter',
    templateUrl: './dictionary-nationalities-filter.component.html',
    styleUrls: ['./dictionary-nationalities-filter.component.sass'],
    animations: [fade]
})
export class DictionaryNationalitiesFilterComponent implements OnInit, OnDestroy {

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Register form and it's controls
     */
    form = new FormGroup({
        name: new FormControl(''),
        onlyActive: new FormControl(true),
    });

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(@Inject(MAT_BOTTOM_SHEET_DATA) bottomSheet: string,
                private _bottomSheetRef: MatBottomSheetRef<DictionaryNationalitiesFilterComponent>,
                private snackbar: MatSnackBar,
                private route: ActivatedRoute,
                private router: Router) {
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.form.patchValue({
            name: this.route.snapshot.queryParams.name,
            onlyActive: this.route.snapshot.queryParams.onlyActive
        });
    }

    ngOnDestroy() { }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Emit filter criterias up
     */
    submitFilter(isReset?: boolean) {
        if (isReset) {
            this.form.reset();
            return;
        }

        const criterias: DictionaryNationalitiesFetchCriterias = this.form.value;

        if (this.form.pristine && (!this.route.snapshot.queryParams.name && !this.route.snapshot.queryParams.onlyActive))  {
            this.snackbar.open('Установите параметры фильтрации');
            return;
        }

        if (!criterias.name) delete criterias.name;
        if (criterias.onlyActive === false) delete criterias.onlyActive;

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: criterias
        });

        this._bottomSheetRef.dismiss();
    }
}
