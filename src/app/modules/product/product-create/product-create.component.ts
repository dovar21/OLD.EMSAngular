import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { VALIDATION_ERRORS } from 'src/app/modules/common/lexicon/ru/validation-dictionary';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';
import { Product, ProductCreate, ProductService } from '../product.service';
import {
    DictionaryProductGroupsAutocomplete,
    DictionaryProductGroupsService
} from '../../dictionary/dictionary-products-groups/dictionary-product-groups.service';
import { AutocompleteUnits, DictionaryUnitsService } from '../../dictionary/dictionary-units/dictionary-units.service';
import { DictionaryTareAutocomplete, DictionaryTareService } from '../../dictionary/dictionary-tare/dictionary-tare.service';
import { Router } from '@angular/router';

@Component({
    selector: 'product-create',
    templateUrl: './product-create.component.html',
    styleUrls: ['./product-create.component.sass']
})
export class ProductCreateComponent implements OnInit, OnDestroy {
    /**
     * Department form.
     */
    form: FormGroup;

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Page heading.
     */
    modalAction: string;

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Form values for request.
     */
    payload: ProductCreate;

    /**
     * List of productGroups for selectbox
     */
    productGroups: DictionaryProductGroupsAutocomplete[];

    /**
     * List of autocomplete dictionary-units for selectbox
     */
    units: AutocompleteUnits[];

    /**
     * List of dictionary-tare for selectbox
     */
    tareArray: DictionaryTareAutocomplete[];

    /**
     * An object with all validation erros.
     */
    validationErrors = VALIDATION_ERRORS;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private dialogRef: MatDialogRef<ProductCreateComponent>,
                private snackbar: MatSnackBar,
                private productsGroupsService: DictionaryProductGroupsService,
                private unitsService: DictionaryUnitsService,
                private tareService: DictionaryTareService,
                private service: ProductService,
                private router: Router,
                private fb: FormBuilder) {

        this.form = this.fb.group({
            title: ['', Validators.required],
            productGroupId: [null, Validators.required],
            unitId: [null, Validators.required],
            tareId: [null, Validators.required],
            quantityPerTare: ['', Validators.required]
        });
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.modalAction = 'Добавление товара';
        this.getProductsGroups();
        this.getUnits();
        this.getTare();
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Get all productsGroups
     */
    getProductsGroups() {
        this.productsGroupsService
            .getDictionaryProductGroupsSelectListItems()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.productGroups = response.data;
            });
    }

    /**
     * Get all dictionary-units
     */
    getUnits() {
        this.unitsService
            .getAutocompleteDictionaryUnits()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.units = response.data;
            });
    }

    /**
     * Get all dictionary-tare
     */
    getTare() {
        this.tareService
            .getDictionaryTareAutocomplete()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.tareArray = response.data;
            });
    }

    /**
     * Handle redirection logic after form submit.
     * @param redirectTo Where to redirect after submit (list || view) product
     * @param formDirective Referance to form directive for clearing it.
     */
    submit(redirectTo: 'saveAndContinue'|'onlySave', formDirective: FormGroupDirective) {
        // Mark form controls as touched to trigger validation visibility
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            this.snackbar.open('В форме содержатся ошибки');
            return false;
        }

        this.payload = this.form.value;
        this.isRequesting = true;
        this.form.disable();
        this.service
            .submit(this.payload)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.isRequesting = false;
                    this.snackbar.open('Товар успешно добавлен');
                    this.redirect(redirectTo, formDirective, response.data);
                },
                (error: any) => {
                    this.form.enable();
                    if (error.status === 400) {
                        error.error.errors.forEach(error => {
                            if (error.code === 1005) this.form.get('title').setErrors({ duplicateTitle: true });
                        });
                    }
                },
                () => {
                    this.isRequesting = false;
                    this.form.enable();
                }
            );
    }

    // -------------------------------------------------------------------------
    // Private methods
    // -------------------------------------------------------------------------

    /**
     * Handle redirection logic after form submit.
     * @param redirectTo Where to redirect after submit (list || view) product
     * @param formDirective Referance to form directive for clearing it.
     * @param product response date
     */
    private redirect(redirectTo: 'saveAndContinue'|'onlySave', formDirective: FormGroupDirective, product: Product) {
        switch (redirectTo) {
            case 'saveAndContinue':
                this.router.navigate(['/products/', product.id]);
                break;

            case 'onlySave':
                formDirective.resetForm();
                this.form.reset();
                this.dialogRef.close(product);
                break;
        }
    }
}
