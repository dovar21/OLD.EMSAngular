import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { VALIDATION_ERRORS } from 'src/app/modules/common/lexicon/ru/validation-dictionary';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';
import {Department, DictionaryDepartmentsService} from '../dictionary-departments.service';

@Component({
    selector: 'dictionary-departments-create-update',
    templateUrl: './dictionary-departments-create-update.component.html',
    styleUrls: ['./dictionary-departments-create-update.component.sass']
})
export class DictionaryDepartmentsCreateUpdateComponent implements OnInit, OnDestroy {
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
    payload: Department;

    /**
     * Department form.
     */
    form: FormGroup;

    /**
     * An object with all validation erros.
     */
    validationErrors = VALIDATION_ERRORS;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<DictionaryDepartmentsCreateUpdateComponent>,
        private snackbar: MatSnackBar,
        private service: DictionaryDepartmentsService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            isActive: true,
        });
    }

    ngOnInit() {
        if (this.data.id) {
            this.title = 'Редактировние записи';
            this.form.disable();
            this.getDepartmentsById();
        } else {
            this.title = 'Добавить запись';
        }

    }

    /**
     * Get department by ID
     */
    getDepartmentsById() {
        this.isRequesting = true;

        this.service
            .getDepartmentsById(this.data.id)
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

    ngOnDestroy() { }
}
