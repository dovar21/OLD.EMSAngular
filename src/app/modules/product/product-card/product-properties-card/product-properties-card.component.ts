import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { fade } from 'src/app/animations/all';
import { Product, ProductCreate } from '../../product.service';
import { FormGroup } from '@angular/forms';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { componentDestroyed } from '../../../common/utils';
import {
    DictionaryProductGroupsAutocomplete,
    DictionaryProductGroupsService
} from '../../../dictionary/dictionary-products-groups/dictionary-product-groups.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { DictionaryCountryAutocomplete, DictionaryCountriesService } from '../../../dictionary/dictionary-countries/dictionary-countries.service';
import { DictionaryBrandAutocomplete, DictionaryBrandsService } from '../../../dictionary/dictionary-brands/dictionary-brands.service';
import { AutocompleteUnits, DictionaryUnitsService } from '../../../dictionary/dictionary-units/dictionary-units.service';
import { DictionaryTareAutocomplete, DictionaryTareService } from '../../../dictionary/dictionary-tare/dictionary-tare.service';

@Component({
    selector: 'product-properties-card',
    templateUrl: './product-properties-card.component.html',
    styleUrls: ['./product-properties-card.component.sass'],
    animations: [fade]
})
export class ProductPropertiesCardComponent implements OnChanges, OnDestroy {
    // -------------------------------------------------------------------------
    // Inputs / Outputs
    // -------------------------------------------------------------------------

    /**
     * Product which we look
     */
    @Input() product: Product;

    /**
     * Creation form.
     */
    @Input() groupForm: FormGroup;

    /**
     * Put payload by product ID
     */
    @Input() payload: ProductCreate;

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * List of mathced users when typing into autocomplete field.
     */
    filteredProductGroups: Observable<DictionaryProductGroupsAutocomplete[]>;

    /**
     * List of mathced users when typing into autocomplete field.
     */
    filteredCountries: Observable<DictionaryCountryAutocomplete[]>;

    /**
     * List of mathced users when typing into autocomplete field.
     */
    filteredBrands: Observable<DictionaryBrandAutocomplete[]>;

    /**
     * List of mathced users when typing into autocomplete field.
     */
    filteredUnits: Observable<AutocompleteUnits[]>;

    /**
     * List of mathced users when typing into autocomplete field.
     */
    filteredTareArray: Observable<DictionaryTareAutocomplete[]>;

    // -------------------------------------------------------------------------
    // Private properties
    // -------------------------------------------------------------------------

    /**
     *  List of productGroup.
     */
    private productGroups: DictionaryProductGroupsAutocomplete[];

    /**
     *  List of dictionary-countries.
     */
    private countries: DictionaryCountryAutocomplete[];

    /**
     *  List of dictionary-brands.
     */
    private brands: DictionaryBrandAutocomplete[];

    /**
     *  List of dictionary-units.
     */
    private units: AutocompleteUnits[];

    /**
     *  List of dictionary-units.
     */
    private tareArray: DictionaryTareAutocomplete[];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private productsGroupsService: DictionaryProductGroupsService,
                private countriesService: DictionaryCountriesService,
                private brandsService: DictionaryBrandsService,
                private unitsService: DictionaryUnitsService,
                private tareService: DictionaryTareService,
                private snackbar: MatSnackBar) {

    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnChanges(changes: SimpleChanges) {
        if (changes['product'] && changes['product'].currentValue)
            this.groupForm.patchValue(this.product);
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Validation autocomplete and set error in input
     * @param event Event object.
     * @param formControlName define validation field ('productGroup'|'countryOfOrigin'|'brand'|'unit'|'tare')
     */
    validationAutocomplete(event: any, formControlName: 'productGroup'|'countryOfOrigin'|'brand'|'unit'|'tare') {
        switch (formControlName) {
            case 'productGroup':
                if (this.productGroups && this.productGroups.length > 0) {
                    const foundGroup = this.productGroups.find(
                        productGroup => productGroup.name === event.target.value
                    );
                    if (!foundGroup)
                        this.groupForm.get('productGroup').setErrors({ objectNotFound: true });
                }
                break;

            case 'countryOfOrigin':
                if (this.countries && this.countries.length > 0) {
                    const foundCountry = this.countries.find(country => country.name === event.target.value);
                    if (!foundCountry)
                        this.snackbar.open(`Рекомендуем вам указать 'Страну производства'.`);
                }
                break;

            case 'brand':
                if (this.brands && this.brands.length > 0) {
                    const foundBrand = this.brands.find(brand => brand.name === event.target.value);
                    if (!foundBrand)
                        this.snackbar.open(`Рекомендуем вам указать 'Бренд'.`);
                }
                break;

            case 'unit':
                if (this.units && this.units.length > 0) {
                    const foundUnit = this.units.find(unit => unit.name === event.target.value);
                    if (!foundUnit) this.groupForm.get('unit').setErrors({objectNotFound: true});
                }
                break;

            case 'tare':
                if (this.tareArray && this.tareArray.length > 0) {
                    const foundTare = this.tareArray.find(tare => tare.name === event.target.value);
                    if (!foundTare) this.groupForm.get('tare').setErrors({objectNotFound: true});
                }
                break;
        }
    }

    /**
     * MatAutocomplete select in object.
     * @param value type (string|number)
     * value number can only be when the type QuantityPerTare
     * @param type Product properties (ProductGroup|Country|Brand|Unit|Tare|QuantityPerTare)
     */
    productPropertiesSelect(value: string|number, type: 'ProductGroup'|'Country'|'Brand'|'Unit'|'Tare'|'QuantityPerTare') {
        let valueNumber: number;
        let valueString: string;

        if (typeof value === 'string') {
            valueString = value;
        } else if (typeof value === 'number') {
            valueNumber = value;
        }

        switch (type) {
            case 'ProductGroup':
                if (this.product.productGroup === valueString) return;
                const foundGroup = this.productGroups.find(productGroup => productGroup.name === valueString);
                this.payload.productGroupId = foundGroup.id;
                break;

            case 'Country':
                if (this.product.countryOfOrigin === valueString) return;
                const foundCountry = this.countries.find(country => country.name === valueString);
                this.payload.countryOfOriginId = foundCountry.id;
                break;

            case 'Brand':
                if (this.product.brand === valueString) return;
                const foundBrand = this.brands.find(brand => brand.name === valueString);
                this.payload.brandId = foundBrand.id;
                break;

            case 'Unit':
                if (this.product.unit === valueString) return;
                const foundUnit = this.units.find(unit => unit.name === valueString);
                this.payload.unitId = foundUnit.id;
                break;

            case 'Tare':
                if (this.product.tare === valueString) return;
                const foundTare = this.tareArray.find(tare => tare.name === valueString);
                this.payload.tareId = foundTare.id;
                break;

            case 'QuantityPerTare':
                if (this.product.quantityPerTare === valueNumber) return;
                this.payload.quantityPerTare = valueNumber;
                break;
        }
    }

    /**
     * Save quantityPerTare
     */
    onBlurMethod() {
        if (this.groupForm.value.quantityPerTare === 0 || this.groupForm.value.quantityPerTare > 0)
            this.productPropertiesSelect(this.groupForm.value.quantityPerTare, 'QuantityPerTare');
    }

    /**
     * Get all productsGroups
     */
    getProductsGroups() {
        if (this.productGroups && this.productGroups.length > 0) return;

        this.productsGroupsService
            .getDictionaryProductGroupsSelectListItems()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.productGroups = response.data;
                    this.filteredProductGroups = this.groupForm.get('productGroup').valueChanges.pipe(
                        startWith(''),
                        map(value => {
                            if (!value) return;

                            if (typeof value === 'string') {
                                return value;
                            } else {
                                return value.name;
                            }

                        }),
                        map(name => (name ? this.filterProductAutocomplete(name, 'productGroup') : this.productGroups.slice()))
                    );
                },
                error => {
                    this.groupForm.enable();
                },
                () => {
                    this.groupForm.enable();
                }
            );
    }

    /**
     * Get all dictionary-countries
     */
    getCountries() {
        if (this.countries && this.countries.length > 0) return;

        this.countriesService
            .getDictionaryCountrySelectItems()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.countries = response.data;
                    this.filteredCountries = this.groupForm.get('countryOfOrigin').valueChanges.pipe(
                        startWith(''),
                        map(value => {
                            if (!value) return;

                            if (typeof value === 'string') {
                                return value;
                            } else {
                                return value.name;
                            }

                        }),
                        map(name => (name ? this.filterProductAutocomplete(name, 'country') : this.countries.slice()))
                    );
                },
                error => {
                    this.groupForm.enable();
                },
                () => {
                    this.groupForm.enable();
                }
            );
    }

    /**
     * Get all dictionary-brands
     */
    getBrands() {
        if (this.brands && this.brands.length > 0) return;

        this.brandsService
            .getDictionaryBrandsSelectListItems()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.brands = response.data;
                    this.filteredBrands = this.groupForm.get('brand').valueChanges.pipe(
                        startWith(''),
                        map(value => {
                            if (!value) return;

                            if (typeof value === 'string') {
                                return value;
                            } else {
                                return value.name;
                            }

                        }),
                        map(name => (name ? this.filterProductAutocomplete(name, 'brand') : this.brands.slice()))
                    );
                },
                error => {
                    this.groupForm.enable();
                },
                () => {
                    this.groupForm.enable();
                }
            );
    }

    /**
     * Get all dictionary-units
     */
    getUnits() {
        if (this.units && this.units.length > 0) return;

        this.unitsService
            .getAutocompleteDictionaryUnits()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.units = response.data;
                    this.filteredUnits = this.groupForm.get('unit').valueChanges.pipe(
                        startWith(''),
                        map(value => {
                            if (!value) return;

                            if (typeof value === 'string') {
                                return value;
                            } else {
                                return value.name;
                            }

                        }),
                        map(name => (name ? this.filterProductAutocomplete(name, 'unit') : this.units.slice()))
                    );
                },
                error => {
                    this.groupForm.enable();
                },
                () => {
                    this.groupForm.enable();
                }
            );
    }

    /**
     * Get all dictionary-tare array
     */
    getTareArray() {
        if (this.tareArray && this.tareArray.length > 0) return;

        this.tareService
            .getDictionaryTareAutocomplete()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.tareArray = response.data;
                    this.filteredTareArray = this.groupForm.get('tare').valueChanges.pipe(
                        startWith(''),
                        map(value => {
                            if (!value) return;

                            if (typeof value === 'string') {
                                return value;
                            } else {
                                return value.name;
                            }

                        }),
                        map(name => (name ? this.filterProductAutocomplete(name, 'tare') : this.tareArray.slice()))
                    );
                },
                error => {
                    this.groupForm.enable();
                },
                () => {
                    this.groupForm.enable();
                }
            );
    }

    // -------------------------------------------------------------------------
    // Private methods
    // -------------------------------------------------------------------------

    /**
     * Filter values when typing into autocomplete field.
     * @param name DictionaryProductGroup name.
     * @param properties type (productGroup|country|brand|unit|tare).
     */
    private filterProductAutocomplete(name: string, properties: 'productGroup'|'country'|'brand'|'unit'|'tare'): any[] {
        const filterValue = name.toLowerCase();
        switch (properties) {
            case 'productGroup':
                return this.productGroups.filter(productGroup => productGroup.name.toLowerCase().includes(filterValue));

            case 'country':
                return this.countries.filter(country => country.name.toLowerCase().includes(filterValue));

            case 'brand':
                return this.brands.filter(brand => brand.name.toLowerCase().includes(filterValue));

            case 'unit':
                return this.units.filter(unit => unit.name.toLowerCase().includes(filterValue));

            case 'tare':
                return this.tareArray.filter(tare => tare.name.toLowerCase().includes(filterValue));
        }
    }
}
