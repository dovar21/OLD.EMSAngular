import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatSnackBar } from '@angular/material';
import { fade } from 'src/app/animations/all';
import { DictionaryTareFetchCriterias } from '../dictionary-tare.service';

export interface FilterData {
    name?: string;
    onlyActive?: boolean;
}

@Component({
    selector: 'dictionary-tare-filter',
    templateUrl: './dictionary-tare-filter.component.html',
    styleUrls: ['./dictionary-tare-filter.component.sass'],
    animations: [fade]
})
export class DictionaryTareFilterComponent implements OnInit, OnDestroy {

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
    // Input/Output
    // -------------------------------------------------------------------------

    /**
     * Set up EventEmmiter to pass filter data up
     */
    @Output() onFilter = new EventEmitter<FilterData>();
    @Output() onResetFilter = new EventEmitter<boolean>();

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(@Inject(MAT_BOTTOM_SHEET_DATA) bottomSheet: string,
                private _bottomSheetRef: MatBottomSheetRef<DictionaryTareFilterComponent>,
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

        const criterias: DictionaryTareFetchCriterias = this.form.value;

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
