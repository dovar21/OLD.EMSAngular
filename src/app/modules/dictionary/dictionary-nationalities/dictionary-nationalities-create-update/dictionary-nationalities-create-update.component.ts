import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { VALIDATION_ERRORS } from 'src/app/modules/common/lexicon/ru/validation-dictionary';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';
import {DictionaryNationalitiesService, DictionaryNationality} from '../dictionary-nationalities.service';

@Component({
    selector: 'dictionary-nationalities-create-update',
    templateUrl: './dictionary-nationalities-create-update.component.html',
    styleUrls: ['./dictionary-nationalities-create-update.component.sass']
})
export class DictionaryNationalitiesCreateUpdateComponent implements OnInit, OnDestroy {

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
    payload: DictionaryNationality;

    /**
     * DictionaryNationality form.
     */
    form: FormGroup;

    /**
     * An object with all validation erros.
     */
    validationErrors = VALIDATION_ERRORS;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<DictionaryNationalitiesCreateUpdateComponent>,
                private snackbar: MatSnackBar,
                private service: DictionaryNationalitiesService,
                private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            isActive: true,
        });
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        if (this.data.id) {
            this.title = 'Редактировние записи';
            this.form.disable();
            this.getNationalitiesById();
        } else {
            this.title = 'Добавить запись';
        }
    }

    ngOnDestroy() { }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Get nationality by ID
     */
    getNationalitiesById() {
        this.isRequesting = true;

        this.service
            .getDictionaryNationalitiesById(this.data.id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.form.patchValue({
                        name: this.data.name,
                        isActive: response.data.isActive
                    });
                    this.form.enable();
                },
                error => (this.isRequesting = false),
                () => (this.isRequesting = false)
            );
    }

    submit() {
        // Mark form controls as touched to trigger validation visibility
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            this.snackbar.open('В форме содержатся ошибки');
            return false;
        }

        this.payload = {
            name: this.form.get('name').value,
            isActive: this.form.get('isActive').value
        };

        let action = 'Create';

        if (this.data.id) {
            action = 'Edit';
            this.payload.id = this.data.id;
        }

        this.isRequesting = true;
        this.form.disable();

        this.service
            .submit(action, this.payload)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => this.dialogRef.close('submit'),
                error => {
                    this.isRequesting = false;
                    this.form.enable();

                    if (error.status === 400) {
                        error.error.errors.forEach(error => {
                            if (error.code === 1005) this.form.get('name').setErrors({ duplicateTitle: true });
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
