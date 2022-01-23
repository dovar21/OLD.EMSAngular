import { componentDestroyed } from 'src/app/modules/common/utils';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DictionaryStatusAutocomplete } from 'src/app/modules/dictionary/dictionary-statuses/dictionary-statuses.service';

export interface FilteredValue {
    valueName: any;
    valueId?: number;
    valueType: string;
}

@Component({
    selector: 'counterparty-waybills-filter-list',
    templateUrl: './counterparty-waybills-filter-list.component.html',
    styleUrls: ['./counterparty-waybills-filter-list.component.sass']
})
export class CounterpartyWaybillsFilterListComponent
    implements OnInit, OnDestroy {
    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    /**
     * Set productGroups in (ProductsList) module for filter list.
     */

    @Input()
    waybillStatus: DictionaryStatusAutocomplete[];

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

    constructor(private route: ActivatedRoute, private router: Router) { }

    // -------------------------------------------------------------------------
    // Lifecycle callbacks
    // -------------------------------------------------------------------------
    ngOnInit() {
        this.route.queryParams
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(params => {
                this.selectFilterCatteries = [];
                if (params.statusId) {
                    const foundStatus = this.waybillStatus.find(
                        status => status.id === +params.statusId
                    );

                    this.selectFilterCatteries.push({
                        valueName: foundStatus.name,
                        valueType: 'Статус'
                    });
                }

                if (params.dateFrom)
                    this.selectFilterCatteries.push({
                        valueName: params.dateFrom,
                        valueType: 'Записи с'
                    });

                if (params.dateTo)
                    this.selectFilterCatteries.push({
                        valueName: params.dateTo,
                        valueType: 'Записи по'
                    });
            });
    }

    ngOnDestroy() { }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Remove filter parameter methods and update queryParams.
     */

    removeValue(selectValue: FilteredValue) {
        const params = { ...this.route.snapshot.queryParams };

        switch (selectValue.valueType) {
            case 'Статус':
                delete params.statusId;
                break;

            case 'Записи с':
                delete params.dateFrom;
                break;

            case 'Записи по':
                delete params.dateTo;
                break;
        }

        this.router.navigate([], { queryParams: params });
    }
}
