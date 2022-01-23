import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from '../../../../common/utils';
import { FetchCriterias } from '../email.service';

export interface FilteredValue {
    valueName: any;
    valueId?: number;
    valueType: string;
}

@Component({
    selector: 'email-filter-list',
    templateUrl: './email-filter-list.component.html',
    styleUrls: ['./email-filter-list.component.sass'],
})
export class EmailFilterListComponent implements OnInit, OnDestroy {

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
                // set params in filter catteries because at params.toDate there is such a function
                const criterias: FetchCriterias = params;
                this.selectFilterCatteries = [];
                if (criterias.receiverName) this.selectFilterCatteries.push({ valueName: criterias.receiverName, valueType: 'Имя получателя' });
                if (criterias.receiverEmail) this.selectFilterCatteries.push({ valueName: criterias.receiverEmail, valueType: 'Email получателя' });
                if (criterias.fromDate) this.selectFilterCatteries.push({ valueName: criterias.fromDate, valueType: 'Записи с' });
                if (criterias.toDate) this.selectFilterCatteries.push({ valueName: criterias.toDate, valueType: 'Записи по' });
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
            case 'Имя получателя':
                delete params.receiverName;
                break;

            case 'Email получателя':
                delete params.receiverEmail;
                break;

            case 'Записи с':
                delete params.fromDate;
                break;

            case 'Записи по':
                delete params.toDate;
                break;
        }

        this.router.navigate([], { queryParams: params });
    }

}
