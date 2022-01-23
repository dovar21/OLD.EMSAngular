import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA, MatSnackBar } from '@angular/material';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { DictionaryCountryAutocomplete } from '../../dictionary/dictionary-countries/dictionary-countries.service';

@Component({
    selector: 'counterparty-filter.component',
    templateUrl: 'counterparty-filter.component.html',
    styleUrls: ['./counterparty-filter.component.sass']
})
export class CounterpartyFilterComponent implements OnInit, OnDestroy {
    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Register form and it's controls
     */
    form = new FormGroup({
        name: new FormControl(null),
        countryId: new FormControl(null),
        isSupplier: new FormControl(null),
        isBuyer: new FormControl(null),
        itn: new FormControl(null)
    });

    selectTypes: string[] = [];

    /**
     * List of DictionaryCountryAutocomplete for selectbox
     */
    countries: DictionaryCountryAutocomplete[];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA)
        public data: any,
        private _bottomSheetRef: MatBottomSheetRef<CounterpartyFilterComponent>,
        private snackbar: MatSnackBar,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.countries = this.data;
        this.form.patchValue({
            name: this.route.snapshot.queryParams.name,
            countryId: this.route.snapshot.queryParams.countryId,
            itn: this.route.snapshot.queryParams.itn
        });

        if (this.route.snapshot.queryParams.isSupplier)
            this.selectTypes.push('Поставщик');
        if (this.route.snapshot.queryParams.isBuyer)
            this.selectTypes.push('Покупатель');
    }

    ngOnDestroy() { }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Emit filter criterias up
     */
    submitFilter(isReset?: boolean) {
        if (
            (this.form.pristine || !this.form.value) &&
            this.selectTypes.length < 1
        ) {
            this.snackbar.open('Установите параметры фильтрации');
            return;
        }

        if (isReset) {
            this.form.reset();
            this.selectTypes = [];
            return;
        }

        if (!!this.selectTypes.find(selectType => selectType === 'Поставщик'))
            this.form.patchValue({ isSupplier: true });

        if (!!this.selectTypes.find(selectType => selectType === 'Покупатель'))
            this.form.patchValue({ isBuyer: true });

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: this.form.value
        });

        this._bottomSheetRef.dismiss();
    }
}
