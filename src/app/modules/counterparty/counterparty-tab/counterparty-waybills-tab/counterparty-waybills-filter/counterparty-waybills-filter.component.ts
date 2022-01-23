import { CounterpartyFilterComponent } from './../../../counterparty-filter/counterparty-filter.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { CounterpartyWaybillsFetchCriteries } from '../../../counterparty.service';
import * as moment from 'moment-timezone';
import { DictionaryStatusAutocomplete } from 'src/app/modules/dictionary/dictionary-statuses/dictionary-statuses.service';
import { momentX } from 'src/app/modules/common/utils';

@Component({
    selector: 'counterparty-waybills-filter',
    templateUrl: './counterparty-waybills-filter.component.html',
    styleUrls: ['./counterparty-waybills-filter.component.sass']
})
export class CounterpartyWaybillsFilterComponent implements OnInit {
    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    waybillStatus: DictionaryStatusAutocomplete[];

    /**
     * Register form and it's controls
     */
    form = new FormGroup({
        dateFrom: new FormControl(null),
        dateTo: new FormControl(null),
        statusId: new FormControl(null)
    });

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA)
        public data: DictionaryStatusAutocomplete[],
        private route: ActivatedRoute,
        private router: Router,
        private snackbar: MatSnackBar,
        private _bottomSheetRef: MatBottomSheetRef<CounterpartyFilterComponent>
    ) { }

    ngOnInit() {
        this.waybillStatus = this.data;

        if (this.route.snapshot.queryParams.dateFrom || this.route.snapshot.queryParams.dateTo) {
            this.form.patchValue({
                ...this.route.snapshot.queryParams,
                dateFrom: momentX(this.route.snapshot.queryParams.dateFrom),
                dateTo: momentX(this.route.snapshot.queryParams.dateTo)
            });
        } else this.form.patchValue(this.route.snapshot.queryParams);
    }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Emit filter criterias up
     */

    submitFilter(isReset?: boolean) {
        if (isReset) {
            this.form.reset();
            console.log(this.form.value);
            return;
        }

        if (this.form.pristine || !this.form.value) {
            this.snackbar.open('Установите параметры фильтрации');
            return;
        }

        // TODO: Fix
        const criterias: CounterpartyWaybillsFetchCriteries = {
            ...this.form.value
        };

        for (let key in this.form.value) {
            if (key === 'dateFrom' || key === 'dateTo')
                // @ts-ignore //Converting date to string for queryParams
                criterias[key] = moment(criterias[key]).toDateString();

            if ((this.form.get(key).pristine && this.form.get(key).value == '') || criterias[key] == 'Invalid date')
                criterias[key] = null;
        }

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: criterias,
            queryParamsHandling: 'merge'
        });

        if (this.form.valid)
            this._bottomSheetRef.dismiss();
    }
}
