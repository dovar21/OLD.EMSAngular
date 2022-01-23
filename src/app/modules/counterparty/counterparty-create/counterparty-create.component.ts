import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import {
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    Validators
} from '@angular/forms';
import { VALIDATION_ERRORS } from 'src/app/modules/common/lexicon/ru/validation-dictionary';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';
import { Router, ActivatedRoute } from '@angular/router';
import {
    CounterpartyCreate,
    CounterpartyService,
    CounterpartyImage
} from '../counterparty.service';
import {
    DictionaryCountryAutocomplete,
    DictionaryCountriesService
} from '../../dictionary/dictionary-countries/dictionary-countries.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEDITOR_CONFIG } from '../../../app.config';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';

@Component({
    selector: "counterparty-create",
    templateUrl: "./counterparty-create.component.html",
    styleUrls: ["./counterparty-create.component.sass"]
})
export class CounterpartyCreateComponent implements OnInit, OnDestroy {
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
            items: [
                'heading',
                '|',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                'blockQuote'
            ]
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
    payload: CounterpartyCreate;

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
    counterpartImage: string;

    /**
     *Select type field in the form
     *
     */
    selectTypes: string[] = [];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(public dialogRef: MatDialogRef<CounterpartyCreateComponent>,
                private countriesService: DictionaryCountriesService,
                private service: CounterpartyService,
                private snackbar: MatSnackBar,
                private fb: FormBuilder,
                private router: Router,
                private route: ActivatedRoute) {

        this.form = this.fb.group({
            name: ['', Validators.required],
            countryId: ['', Validators.required],
            website: ['', Validators.required],
            itn: ['', Validators.required],
            description: ['', Validators.required],
            selectTypes: [[], Validators.required]
        });
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.modalAction = 'Добавление контрагента';
        this.getCountries();
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
        this.form.patchValue({ photoPath: image });
        this.counterpartImage = image;
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
        formData.append('file', fileInput.files[0], fileInput.files[0].name);

        fileReader.onload = e => {
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

        this.payload = {
            imageFile: this.counterpartImage,
            name: this.form.get('name').value,
            countryId: this.form.get('countryId').value,
            website: this.form.get('website').value,
            description: this.form.get('description').value,
            itn: this.form.get('itn').value,
            isSupplier: !!this.selectTypes.find(selectType => selectType === 'Поставщик'),
            isBuyer: !!this.selectTypes.find(selectType => selectType === 'Покупатель')
        };

        this.isRequesting = true;
        this.form.disable();
        this.service
            .submit(this.payload)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.snackbar.open('Товар успешно добавлен');
                    this.router.navigate(['/counterparties/', response.data.id]);
                },
                (error: any) => {
                    this.isRequesting = false;
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
}
