import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { MyProfileService, EmployeeData } from './my-profile.service';
import { fade } from 'src/app/animations/all';
import { openDialogLightbox, componentDestroyed } from 'src/app/modules/common/utils';
import { VALIDATION_ERRORS } from 'src/app/modules/common/lexicon/ru/validation-dictionary';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.sass'],
    animations: [fade]
})
export class MyProfileComponent implements OnInit, OnDestroy {
    /**
     * Employee data that gets populated to 'Главное' tab.
     */
    employeeData: EmployeeData;

    /**
     * Does the same thing as field above, but extracted to separate
     * filed to not invoke global loading indicator while updating
     * just employee data. Maybe its better to extract editing this
     * data logic to separate component, but component naming is
     * already confusing at this point.
     */
    isRequestingEditUserDetails: boolean;

    /**
     * Determines if user wants to edit his essential data.
     */
    isEditingUserDetails: boolean;

    /**
     * Register update essentials form and it's controls.
     */
    form = new FormGroup({
        email: new FormControl('', [
            Validators.required,
            Validators.pattern(
                "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
            )
        ]),
        factualAddress: new FormControl('', Validators.required)
    });

    /**
     * An object with all validation erros.
     */
    validationErrors = VALIDATION_ERRORS;

    constructor(private service: MyProfileService, private snackbar: MatSnackBar, public dialog: MatDialog) {}

    ngOnInit() {
        this.getEmployeeData();
    }

    /**
     * Open lightbox with passed photo and name.
     * @param photoPath Photo path.
     * @param fullName Full name.
     */
    openDialogLightbox(photoPath: string, fullName: string) {
        openDialogLightbox(photoPath, fullName, this.dialog);
    }

    /**
     * Get employee data.
     */
    getEmployeeData() {
        this.service
            .getEmployeeData()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.employeeData = response.data;
                this.form.patchValue(response.data);
            });
    }

    /**
     * Edit employee data.
     */
    editUserDetails() {
        // Mark form controls as touched to trigger validation visibility
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            this.snackbar.open('В форме содержатся ошибки');

            return false;
        }

        this.isRequestingEditUserDetails = true;
        this.form.disable();

        this.service
            .editUserDetails(this.form.value)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    console.log(response);

                    if (this.form.touched) {
                        this.snackbar.open('Изменения сохранены');

                        // Populate updated data to UI without API call
                        this.employeeData = { ...this.employeeData, ...this.form.value };
                    }
                },
                (error: any) => {
                    this.isRequestingEditUserDetails = false;
                    this.form.enable();

                    if (error.status === 400) {
                        error.error.errors.forEach(error => {
                            if (error.code === 1002) this.form.get('email').setErrors({ duplicateEmail: true });
                        });
                    }
                },
                () => {
                    this.isRequestingEditUserDetails = false;
                    this.isEditingUserDetails = false;
                    this.form.enable();
                }
            );
    }

    ngOnDestroy() {}
}
