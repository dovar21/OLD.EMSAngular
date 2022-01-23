import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { NewsAndInfoService } from '../information.service';
import { REGEXP } from 'src/app/app.config';
import { VALIDATION_ERRORS } from 'src/app/modules/common/lexicon/ru/validation-dictionary';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';
import {
    AutocompleteDictionaryUsefulLinksCategory,
    DictionaryUsefulLinksCategoriesService
} from '../../modules/dictionary/dictionary-useful-links-categories/dictionary-useful-links-categories.service';

@Component({
    selector: 'create-update-useful-link',
    templateUrl: './create-update-useful-link.component.html'
})
export class CreateUpdateUsefulLinkComponent implements OnInit, OnDestroy {
    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Dialog title.
     */
    title: string;

    /**
     * Creation form.
     */
    form: FormGroup;

    /**
     * Form values for request
     */
    private payload: any;

    /**
     *  Useful Link categories.
     */
    categories: AutocompleteDictionaryUsefulLinksCategory[];

    /**
     * An object with all validation erros.
     */
    validationErrors = VALIDATION_ERRORS;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CreateUpdateUsefulLinkComponent>,
        private snackbar: MatSnackBar,
        private fb: FormBuilder,
        private service: NewsAndInfoService,
        private usefulLinksCategoriesService: DictionaryUsefulLinksCategoriesService
    ) {
        this.form = this.fb.group({
            usefulLinkCategoryId: ['', Validators.required],
            title: ['', Validators.required],
            description: ['', Validators.required],
            isActive: [true],
            url: ['', [Validators.required, Validators.pattern(REGEXP.URL)]]
        });
    }

    ngOnInit() {
        if (this.data.id) {
            this.form.disable();
            this.title = 'Редактировние записи';
            this.getById();
        } else this.title = 'Добавить запись';

        this.getCategories();
    }

    /**
     * Get useful link by ID.
     */
    private getById() {
        this.service
            .getById('UsefulLink', this.data.id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(respone => {
                this.form.patchValue(respone.data);
            });
    }

    /**
     * Get UsefulLinksCategories.
     */
    private getCategories() {
        this.isRequesting = true;
        this.form.disable();
        this.usefulLinksCategoriesService
            .getDictionaryUsefulLinksCategoriesSelectListItems()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.categories = response.data;
                },
                (error: Response) => {
                    this.isRequesting = false;
                    this.form.enable();
                },
                () => {
                    this.isRequesting = false;
                    this.form.enable();
                }
            );
    }

    submit() {
        // Mark form controls as touched to trigger validation visibility
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            this.snackbar.open('В форме содержатся ошибки');
            return false;
        }

        this.payload = this.form.value;
        if (this.data.id) this.payload.id = this.data.id;

        let action = 'Create';

        if (this.data.id) {
            action = 'Edit';
            this.payload.id = this.data.id;
        }

        this.isRequesting = true;
        this.form.disable();

        this.service
            .submit(action, this.data.controllerName, this.payload)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    if (this.form.get('title').value !== '') this.dialogRef.close('entityCreated');
                },
                error => {
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

    ngOnDestroy() { }
}
