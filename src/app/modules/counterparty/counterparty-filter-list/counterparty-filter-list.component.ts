import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { DictionaryCountryAutocomplete } from '../../dictionary/dictionary-countries/dictionary-countries.service';
import { componentDestroyed } from '../../common/utils';

export interface FilteredValue {
    valueName: any;
    valueId?: number;
    valueType: string;
}

@Component({
    selector: 'counterparty-filter-list',
    templateUrl: './counterparty-filter-list.component.html',
    styleUrls: ['./counterparty-filter-list.component.sass'],
})
export class CounterpartyFilterListComponent implements OnInit, OnDestroy {

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    /**
     * Set counties in (CounterpartiesList) module for filter list.
     */
    @Input()
    countries: DictionaryCountryAutocomplete[];

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
                if (params.name) this.selectFilterCatteries.push({ valueName: params.name, valueType: '??????' });
                if (params.isSupplier) this.selectFilterCatteries.push({ valueName: '??????????????????', valueType: '?????? ??????????????????' });
                if (params.isBuyer) this.selectFilterCatteries.push({ valueName: '????????????????????', valueType: '?????? ????????????????????' });
                if (params.itn) this.selectFilterCatteries.push({ valueName: `??????: ${params.itn}`, valueType: '??????' });

                if (params.countryId) {
                    const foundCountry = this.countries.find(country => country.id === +params.countryId);
                    this.selectFilterCatteries.push({ valueName: foundCountry.name, valueId: foundCountry.id, valueType: '????????????' });
                }
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
            case '??????':
                delete params.name;
                break;

            case '?????? ??????????????????':
                delete params.isSupplier;
                break;

            case '?????? ????????????????????':
                delete params.isBuyer;
                break;

            case '??????':
                delete params.itn;
                break;

            case '????????????':
                delete params.countryId;
                break;
        }

        this.router.navigate([], { queryParams: params });
    }

}
