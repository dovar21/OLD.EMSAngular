import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VALIDATION_ERRORS } from 'src/app/modules/common/lexicon/ru/validation-dictionary';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';
import { CounterpartContactCreate, CounterpartyService } from '../counterparty.service';
import { DictionaryCountryAutocomplete, DictionaryCountriesService } from '../../dictionary/dictionary-countries/dictionary-countries.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEDITOR_CONFIG } from '../../../app.config';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';

@Component({
    selector: 'counterparty-contact-create-update',
    templateUrl: './counterparty-contact-create-update.component.html',
    styleUrls: ['./counterparty-contact-create-update.component.sass']
})
export class CounterpartyContactCreateUpdateComponent implements OnInit, OnDestroy {
    /**
     * Department form.
     */
    form: FormGroup;

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

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
    payload: CounterpartContactCreate;

    /**
     * List of productGroups for selectbox
     */
    countries: DictionaryCountryAutocomplete[];

    /**
     * An object with all validation erros.
     */
    validationErrors = VALIDATION_ERRORS;

    /**
     * Shown cropping True || False
     */
    croppingMode: boolean;

    /**
     * Image select
     */
    preview: string;

    /**
     * CounterpartyImage properties from Edit.
     */
    image: string;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public dialogRef: MatDialogRef<CounterpartyContactCreateUpdateComponent>,
                private countriesService: DictionaryCountriesService,
                private service: CounterpartyService,
                private snackbar: MatSnackBar,
                private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            id: [''],
            fullName: fb.control('', Validators.required),
            countryName: fb.control('', Validators.required),
            positionName: fb.control('', Validators.required),
            contacts: fb.control('', Validators.required),
            description: fb.control('', Validators.required),
            photo: [''],
        });
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.modalAction = 'Добавить контакт';
        this.getCountries();
        if (this.data) {
            this.form.disable();
            this.form.patchValue(this.data);
            this.image = this.data.photoPathSmall;
            this.form.enable();
        }
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Set CKEditor output to class field.
     */
    setBody({ editor }: ChangeEvent) {
        this.form.get('description').setValue(editor.getData());
    }

    onSubmitCrop(image: string) {
        this.form.patchValue({ photo: image });
        this.image = image;
        this.croppingMode = false;
    }

    /**
     * Renders selected image to given img tag and assigns it to respective
     * form field
     * @param fileInput Files object
     */
    uploadFile(fileInput: HTMLInputElement): void {
        if (!fileInput.files || (fileInput.files && !fileInput.files[0]))
            return;

        const fileReader = new FileReader();
        fileReader.readAsDataURL(fileInput.files[0]);

        const formData = new FormData();
        formData.append("file", fileInput.files[0], fileInput.files[0].name);

        fileReader.onload = (e) => {
            const target: any = e.target;
            this.preview = target.result;
            this.croppingMode = true;
        };
    }

    /**
     * Get all dictionary-countries
     */
    getCountries() {
        this.countriesService
            .getDictionaryCountrySelectItems()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.countries = response.data;
            });
    }

    /**
     * Handle redirection logic after form submit.
     */
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

        if (this.image !== this.data.photoPathSmall)
            this.payload.photo = this.image;

        this.isRequesting = true;
        this.form.disable();
        if (!this.data.id) {
            this.service
                .submitCreateCounterpartyContact(this.data.counterpartyId, this.payload)
                .pipe(takeUntil(componentDestroyed(this)))
                .subscribe(
                    response => {
                        this.snackbar.open('Контрагент успешно добавлен');
                    },
                    (error: any) => {
                        this.isRequesting = false;
                        this.form.enable();
                        if (error.status === 400) {
                            error.error.errors.forEach(error => {
                                if (error.code === 1005) this.form.get('fullName').setErrors({ duplicateTitle: true });
                                if (error.code === 1005) this.form.get('countryId').setErrors({ duplicateTitle: true });
                                if (error.code === 1005) this.form.get('positionName').setErrors({ duplicateTitle: true });
                                if (error.code === 1005) this.form.get('contacts').setErrors({ duplicateTitle: true });
                                if (error.code === 1005) this.form.get('description').setErrors({ duplicateTitle: true });
                            });
                        }
                    },
                    () => {
                        this.isRequesting = false;
                        this.form.enable();
                        this.dialogRef.close('submit');
                    }
                );
        } else {
            this.service
                .submitUpdateCounterpartyContact(this.data.counterpartyId, this.payload)
                .pipe(takeUntil(componentDestroyed(this)))
                .subscribe(
                    response => {
                        this.snackbar.open('Контрагент успешно добавлен');
                    },
                    (error: any) => {
                        this.isRequesting = false;
                        this.form.enable();
                        if (error.status === 400) {
                            error.error.errors.forEach(error => {
                                if (error.code === 1005) this.form.get('fullName').setErrors({ duplicateTitle: true });
                                if (error.code === 1005) this.form.get('countryId').setErrors({ duplicateTitle: true });
                                if (error.code === 1005) this.form.get('positionName').setErrors({ duplicateTitle: true });
                                if (error.code === 1005) this.form.get('contacts').setErrors({ duplicateTitle: true });
                                if (error.code === 1005) this.form.get('description').setErrors({ duplicateTitle: true });
                            });
                        }
                    },
                    () => {
                        this.isRequesting = false;
                        this.form.enable();
                        this.dialogRef.close('submit');
                    }
                );
        }
    }
}
