import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { VALIDATION_ERRORS } from 'src/app/modules/common/lexicon/ru/validation-dictionary';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';
import { CounterpartyService, CounterpartyOfficeCreate } from '../counterparty.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEDITOR_CONFIG } from '../../../app.config';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { DictionaryCountryAutocomplete, DictionaryCountriesService } from '../../dictionary/dictionary-countries/dictionary-countries.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'counterparty-office-create-update',
    templateUrl: './counterparty-office-create-update.component.html',
    styleUrls: ['./counterparty-office-create-update.component.sass']
})
export class CounterpartyOfficeCreateUpdateComponent implements OnInit, OnDestroy {

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Page heading.
     */
    title: string;

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Form values for request.
     */
    payload: CounterpartyOfficeCreate;

    /**
     * Department form.
     */
    form: FormGroup;

    /**
     * An object with all validation erros.
     */
    validationErrors = VALIDATION_ERRORS;

    /**
     * CKEditor
     */
    Editor = ClassicEditor;

    /**
     * CKEditor config
     */
    editorConfig = {
        ...CKEDITOR_CONFIG,
        toolbar: {
            items: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
        }
    };

    /**
     * List of productGroups for selectbox
     */
    countries: DictionaryCountryAutocomplete[];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public dialogRef: MatDialogRef<CounterpartyOfficeCreateUpdateComponent>,
                private countriesService: DictionaryCountriesService,
                private service: CounterpartyService,
                private route: ActivatedRoute,
                private snackbar: MatSnackBar,
                private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            countryName: [''],
            address: ['', Validators.required],
            contacts: ['', Validators.required],
            description: ['', Validators.required],
            isPrimary: false,
        });
        this.form.patchValue(this.data);
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.title = 'Добавить оффис';
        this.getCountries();
        if (this.data) {
            this.form.disable();
            this.form.patchValue(this.data);
            this.form.enable();
        }
    }

    ngOnDestroy() { }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    submit() {
        // Mark form controls as touched to trigger validation visibility
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            this.snackbar.open('В форме содержатся ошибки');
            return false;
        }

        const foundCountry = this.countries.find(country => country.name === this.form.get('countryName').value);

        this.payload = {
            ...this.form.value,
            id: this.data && this.data.id,
            countryId: foundCountry.id,
        };

        this.isRequesting = true;
        this.form.disable();

        if (!this.payload.id) {
            this.service
                .suubmitCreateOffice(this.data.counterparty.id, this.payload)
                .pipe(takeUntil(componentDestroyed(this)))
                .subscribe(
                    response => {
                        if (response.data.isPrimary) this.data.counterparty.headOffice = response.data;
                        this.dialogRef.close('submit');
                    },
                    error => {
                        this.isRequesting = false;
                        this.form.enable();
                        if (error.status === 400) {
                            error.error.errors.forEach(error => {
                                if (error.code === 1005) this.form.get('address').setErrors({ duplicateTitle: true });
                            });
                        }
                    },
                    () => {
                        this.isRequesting = false;
                        this.form.enable();
                    }
                );
        } else {
            this.service
                .suubmitUpdateOffice(this.data.counterparty.id, this.payload)
                .pipe(takeUntil(componentDestroyed(this)))
                .subscribe(
                    response => {
                        if (response.data.isPrimary) this.data.counterparty.headOffice = response.data;
                        this.dialogRef.close('submit')
                    },
                    error => {
                        this.isRequesting = false;
                        this.form.enable();
                        if (error.status === 400) {
                            error.error.errors.forEach(error => {
                                if (error.code === 1005) this.form.get('address').setErrors({ duplicateTitle: true });
                            });
                        }
                    },
                    () => {
                        this.isRequesting = false;
                        this.form.enable();
                    }
                );
        }
    }

    /**
     * Set CKEditor output to class field.
     */
    setBody({ editor }: ChangeEvent) {
        this.form.get('description').setValue(editor.getData());
    }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Get all dictionary-countries
     */
    private getCountries() {
        this.countriesService
            .getDictionaryCountrySelectItems()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.countries = response.data;
            });
    }
}
