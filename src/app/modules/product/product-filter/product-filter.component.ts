import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatSnackBar } from '@angular/material';
import { fade } from 'src/app/animations/all';
import {
    DictionaryProductGroupsAutocomplete,
    DictionaryProductGroupsService
} from '../../dictionary/dictionary-products-groups/dictionary-product-groups.service';
import { DictionaryBrand, DictionaryBrandsService } from '../../dictionary/dictionary-brands/dictionary-brands.service';
import { ProductFetchCriterias } from '../product.service';

@Component({
    selector: 'product-filter',
    templateUrl: './product-filter.component.html',
    styleUrls: ['./product-filter.component.sass'],
    animations: [fade]
})
export class ProductFilterComponent implements OnInit, OnDestroy {

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Register form and it's controls
     */
    form = new FormGroup({
        title: new FormControl(null),
        productGroupId: new FormControl(null),
        brandId: new FormControl(null),
    });

    /**
     * List of productGroups for selectbox
     */
    productGroups: DictionaryProductGroupsAutocomplete[];

    /**
     * List of dictionary-brands for selectbox
     */
    brands: DictionaryBrand[];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(@Inject(MAT_BOTTOM_SHEET_DATA)
                public data: any,
                private _bottomSheetRef: MatBottomSheetRef<ProductFilterComponent>,
                private productGroupsService: DictionaryProductGroupsService,
                private brandsService: DictionaryBrandsService,
                private snackbar: MatSnackBar,
                private route: ActivatedRoute,
                private router: Router) {
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.productGroups = this.data.productGroups;
        this.brands = this.data.brands;
        this.form.patchValue(this.route.snapshot.queryParams);
    }

    ngOnDestroy() { }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Emit filter criterias up
     */
    submitFilter(isReset?: boolean) {
        if (this.form.pristine && !isReset && (!this.route.snapshot.queryParams.title && !this.route.snapshot.queryParams.productGroupId && !this.route.snapshot.queryParams.brandId))  {
            this.snackbar.open('Установите параметры фильтрации');
            return false;
        }

        if (isReset) {
            this.form.reset();
            return;
        }

        const criterias: ProductFetchCriterias = this.form.value;
        if (!criterias.title) delete criterias.title;

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: criterias
        });

        this._bottomSheetRef.dismiss();
    }

}
