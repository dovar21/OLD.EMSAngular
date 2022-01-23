import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VALIDATION_ERRORS } from 'src/app/modules/common/lexicon/ru/validation-dictionary';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';
import { DictionaryPositions, DictionaryPositionsService } from '../dictionary-positions.service';
import { AutocompleteDepartment, DictionaryDepartmentsService } from '../../dictionary-departments/dictionary-departments.service';

@Component({
    selector: 'dictionary-positions-create-update',
    templateUrl: './dictionary-positions-create-update.component.html',
    styleUrls: ['./dictionary-positions-create-update.component.sass']
})
export class DictionaryPositionsCreateUpdateComponent implements OnInit, OnDestroy {

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
     * Department ID.
     */
    departmentId: number;

    /**
     * Departments values
     */
    departments: AutocompleteDepartment[];

    /**
     * Form values for request.
     */
    payload: DictionaryPositions;

    /**
     * Position form.
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
                private dialogRef: MatDialogRef<DictionaryPositionsCreateUpdateComponent>,
                private snackbar: MatSnackBar,
                private positionsService: DictionaryPositionsService,
                private departmentsService: DictionaryDepartmentsService,
                private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            isActive: true,
            departmentId: [null, Validators.required],
        });
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.isRequesting = true;
        this.form.disable();

        this.departmentsService
            .getDepartmentsSelectItems()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.departments = response.data;
                if (this.data.id) {
                    this.title = 'Редактировние записи';
                    this.getPositionsById(this.data.id);
                } else {
                    this.title = 'Добавить запись';
                    this.isRequesting = false;
                    this.form.enable();
                }
            });
    }

    ngOnDestroy() { }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Get position by ID
     */
    getPositionsById(positionId) {
        this.positionsService
            .getDictionaryPositionsById(positionId)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.form.patchValue({
                        name: this.data.name,
                        isActive: response.data.isActive,
                        departmentId: response.data.departmentId
                    });

                    this.departmentId = response.data.departmentId;
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

        this.payload['departmentId'] = this.form.get('departmentId').value;

        let action = 'Create';

        if (this.data.id) {
            action = 'Edit';
            this.payload.id = this.data.id;
        }

        this.isRequesting = true;
        this.form.disable();

        this.positionsService
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
