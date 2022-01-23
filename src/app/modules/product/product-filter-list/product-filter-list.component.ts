import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from '../../common/utils';
import { DictionaryProductGroup } from '../../dictionary/dictionary-products-groups/dictionary-product-groups.service';
import { DictionaryBrandAutocomplete } from '../../dictionary/dictionary-brands/dictionary-brands.service';

export interface FilteredValue {
    valueName: any;
    valueId?: number;
    valueType: string;
}

@Component({
    selector: 'product-filter-list',
    templateUrl: './product-filter-list.component.html',
    styleUrls: ['./product-filter-list.component.sass'],
})
export class ProductFilterListComponent implements OnInit, OnDestroy {

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    /**
     * Set productGroups in (ProductsList) module for filter list.
     */
    @Input()
    productGroups: DictionaryProductGroup[];

    /**
     * Set dictionary-brands in (ProductsList) module for filter list.
     */
    @Input()
    brands: DictionaryBrandAutocomplete[];

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
                if (params.title) this.selectFilterCatteries.push({ valueName: params.title, valueType: 'Название товара' });

                if (params.productGroupId) {
                    const foundProductGroup = this.productGroups.find(productGroup => productGroup.id === +params.productGroupId);
                    this.selectFilterCatteries.push({ valueName: foundProductGroup.name, valueId: foundProductGroup.id, valueType: 'Группа' });
                }

                if (params.brandId) {
                    const foundBrand = this.brands.find(brand => brand.id === +params.brandId);
                    this.selectFilterCatteries.push({ valueName: foundBrand.name, valueId: foundBrand.id, valueType: 'Бренд' });
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
            case 'Название товара':
                delete params.title;
                break;

            case 'Группа':
                delete params.productGroupId;
                break;

            case 'Бренд':
                delete params.brandId;
                break;
        }

        this.router.navigate([], { queryParams: params });
    }

}
