import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from '../../../common/utils';

export interface FilteredValue {
    valueName: any;
    valueId?: number;
    valueType: string;
}

@Component({
    selector: 'news-categories-filter-list',
    templateUrl: './dictionary-news-categories-filter-list.component.html',
    styleUrls: ['./dictionary-news-categories-filter-list.component.sass'],
})
export class DictionaryNewsCategoriesFilterListComponent implements OnInit, OnDestroy {

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
                if (params.name) this.selectFilterCatteries.push({ valueName: params.name, valueType: 'Название' });
                if (params.onlyActive) this.selectFilterCatteries.push({ valueName: 'Активные', valueType: 'Только активные' });

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
            case 'Название':
                delete params.name;
                break;

            case 'Только активные':
                delete params.onlyActive;
                break;
        }

        this.router.navigate([], { queryParams: params });
    }

}
