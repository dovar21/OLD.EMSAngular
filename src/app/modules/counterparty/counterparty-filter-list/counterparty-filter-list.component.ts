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
                if (params.name) this.selectFilterCatteries.push({ valueName: params.name, valueType: 'Имя' });
                if (params.isSupplier) this.selectFilterCatteries.push({ valueName: 'Поставщик', valueType: 'Тип Поставщик' });
                if (params.isBuyer) this.selectFilterCatteries.push({ valueName: 'Покупатель', valueType: 'Тип Покупатель' });
                if (params.itn) this.selectFilterCatteries.push({ valueName: `ИНН: ${params.itn}`, valueType: 'ИНН' });

                if (params.countryId) {
                    const foundCountry = this.countries.find(country => country.id === +params.countryId);
                    this.selectFilterCatteries.push({ valueName: foundCountry.name, valueId: foundCountry.id, valueType: 'Страна' });
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
            case 'Имя':
                delete params.name;
                break;

            case 'Тип Поставщик':
                delete params.isSupplier;
                break;

            case 'Тип Покупатель':
                delete params.isBuyer;
                break;

            case 'ИНН':
                delete params.itn;
                break;

            case 'Страна':
                delete params.countryId;
                break;
        }

        this.router.navigate([], { queryParams: params });
    }

}
