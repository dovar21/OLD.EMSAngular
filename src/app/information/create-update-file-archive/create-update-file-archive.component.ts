import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewsAndInfoService } from '../information.service';
import { VALIDATION_ERRORS } from 'src/app/modules/common/lexicon/ru/validation-dictionary';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';
import {
    AutocompleteFilesCategory,
    DictionaryFileCategoriesService
} from '../../modules/dictionary/dictionary-files-categories/dictionary-files-categories.service';

@Component({
    selector: 'create-update-file-archive',
    templateUrl: './create-update-file-archive.component.html'
})
export class CreateUpdateFileArchiveComponent implements OnInit, OnDestroy {
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
     *  Useful Link categories.
     */
    categories: AutocompleteFilesCategory[];

    /**
     * Text for selecting file button.
     */
    fileSelectText: string = 'Прикрепить файл';

    /**
     * An object with all validation erros.
     */
    validationErrors = VALIDATION_ERRORS;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CreateUpdateFileArchiveComponent>,
        private snackbar: MatSnackBar,
        private fb: FormBuilder,
        private service: NewsAndInfoService,
        private filesCategoriesService: DictionaryFileCategoriesService
    ) {
        this.form = this.fb.group({
            fileCategoryId: ['', Validators.required],
            title: ['', Validators.required],
            description: ['', Validators.required],
            isActive: [true],
            file: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.getCategories();

        if (this.data.id) {
            this.title = 'Редактировние записи';
            this.getById();
            this.form.get('file').clearValidators();
        } else this.title = 'Добавить запись';
    }

    /**
     * Get item by ID.
     */
    private getById() {
        this.isRequesting = true;
        this.form.disable();

        this.service
            .getById('FileArchive', this.data.id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.form.patchValue(response.data);
                    this.fileSelectText = response.data.fileName;
                },
                error => {
                    this.isRequesting = false;
                    this.form.enable();
                },
                () => {
                    this.isRequesting = false;
                    this.form.enable();
                }
            );
    }

    /**
     * Assign selected file to ReactiveForm field.
     * @param files
     */
    renderFileInfoAndAssignFile(files: FileList) {
        const file = files[0];

        this.fileSelectText = file.name;

        this.form.patchValue({ file: file });
    }

    /**
     * Get UsefulLinksCategories.
     */
    private getCategories() {
        this.isRequesting = true;
        this.form.disable();

        this.filesCategoriesService
            .getFilesCategoriesSelectListItems()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.categories = response.data;
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

    /**
     * Constructs payload for request
     * @return payload FormData
     */
    private constructRequestPayload(): FormData {
        const payload = new FormData();
        const file = this.form.get('file').value;

        if (this.data.id) payload.append('id', this.data.id);

        // Add form fields to FormData
        Object.keys(this.form.value).forEach(key => {
            // Exclude fields with wrong format
            const excludedFields = ['file'];

            if (!excludedFields.includes(key)) payload.append(key, this.form.value[key]);
        });

        // Re-add excluded fields with right format
        if (file) payload.append('file', file, file.name);

        return payload;
    }

    submit() {
        // Mark form controls as touched to trigger validation visibility
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            this.snackbar.open('В форме содержатся ошибки');
            return false;
        }

        let action = 'Create';

        if (this.data.id) action = 'Edit';

        const payload = this.constructRequestPayload();

        this.isRequesting = true;
        this.form.disable();

        this.service
            .submit(action, this.data.controllerName, payload)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.dialogRef.close('entityCreated');
                    this.snackbar.open('Файл загружен.');
                },
                error => {
                    this.isRequesting = false;
                    this.form.enable();
                },
                () => {
                    this.isRequesting = false;
                    this.form.enable();
                }
            );
    }

    ngOnDestroy() { }
}
