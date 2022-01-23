import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PassportData, AdministrationEmployeeUpdatePassportDataService } from './administration-employee-update-passport-data.service';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { ADULT_DATE, MIN_DATE } from 'src/app/app.config';
import { fade } from 'src/app/animations/all';
import { componentDestroyed, momentX } from 'src/app/modules/common/utils';
import { VALIDATION_ERRORS } from 'src/app/modules/common/lexicon/ru/validation-dictionary';
import { takeUntil } from 'rxjs/operators';
import {
    DictionaryNationalityAutocomplete,
    DictionaryNationalitiesService
} from '../../../dictionary/dictionary-nationalities/dictionary-nationalities.service';
import { AdministrationEmployeeService } from '../administration-employee.service';

@Component({
    selector: 'administration-employee-update-passport-data',
    templateUrl: './administration-employee-update-passport-data.component.html',
    styleUrls: ['./administration-employee-update-passport-data.component.sass'],
    animations: [fade]
})
export class AdministrationEmployeeUpdatePassportDataComponent implements OnInit, OnDestroy {

    /**
    * Shown cropping True || False
    */
    croppingMode: boolean;

    /**
   * Uploaded image by input
   */
    uploadedImage: FileList;

    /**
     * Image select
     */
    imagePreview: string;

    /**
     * Page title
     */
    title = this.route.snapshot.data.title;

    /**
     * Determines whether any fetch operation is in progress
     */
    isRequesting: boolean;

    /**
     * Minimum date available to choose from MatDatePicker
     */
    minDate = MIN_DATE;

    /**
     * The max date to show in MatDate picker for age
     */
    aultDate = ADULT_DATE;

    /**
     * Current date
     */
    today = moment();

    /**
     * AdministrationEmployee ID
     */
    id: number;

    /**
     * Passport data that gets populated to 'Паспортные данные' tab
     */
    passportData: PassportData;

    /**
     * List of dictionary-nationalities for selectbox
     */
    nationalities: DictionaryNationalityAutocomplete[];

    /**
     * An object with all validation erros.
     */
    validationErrors = VALIDATION_ERRORS;

    /**
     * Register form.
     */
    form: FormGroup;

    /**
     * Determines whether current administration-employee-view is locked.
     */
    isEmployeeLocked: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: AdministrationEmployeeUpdatePassportDataService,
        public location: Location,
        private snackbar: MatSnackBar,
        private nationalitiesService: DictionaryNationalitiesService,
        private fb: FormBuilder,
        private employeesService: AdministrationEmployeeService
    ) {
        this.form = this.fb.group({
            passportScan: [''],
            passportNumber: ['', [Validators.required, Validators.minLength(5)]],
            passportIssueDate: ['', Validators.required],
            passportIssuer: ['', [Validators.required, Validators.minLength(5)]],
            nationalityId: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
            passportAddress: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    ngOnInit() {
        this.id = +this.route.snapshot.paramMap.get('id');

        this.form.get('nationalityId').disable();
        this.getNationalities();
        this.getPassportData(this.id);
        this.getEmployeeLockStatus();
    }

    /**
     * Get administration-employee-view lock status and assign to field.
     */
    getEmployeeLockStatus() {
        this.employeesService
            .getEssentialData(this.id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.isEmployeeLocked = response.data.lockDate;

                if (response.data.lockDate) {
                    this.form.disable();
                    this.snackbar.open('Изменение данных невозможно по причине блокировки сотрудника.');
                }
            });
    }

    uploadFile(files: FileList) {
        if (!files || (files && !files[0])) return;

        const fileReader = new FileReader();
        fileReader.readAsDataURL(files[0]);
        fileReader.onload = (e) => {
            const target: any = e.target;
            this.uploadedImage = target.result;
            this.croppingMode = true;
        }
    }

    onSubmitCrop(image: string) {
        this.form.get('passportScan').patchValue(image);
        this.croppingMode = false;
        if (image) this.imagePreview = image;
    }


    /**
     * Get passport data
     * @param id AdministrationEmployee ID
     */
    getPassportData(id: number) {
        this.isRequesting = true;
        this.form.disable();

        return this.service
            .get(id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.form.patchValue({
                        ...response.data,
                        dateOfBirth: momentX(response.data.dateOfBirth),
                        passportIssueDate: momentX(response.data.passportIssueDate)
                    });

                    if (response.data.passportScanPath)
                        this.imagePreview = response.data.passportScanPath;

                    this.passportData = response.data;
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

    /**
     * Get dictionary-nationalities
     */
    getNationalities() {
        this.isRequesting = true;

        this.nationalitiesService
            .getDictionaryNationalitiesSelectListItems()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.nationalities = response.data;
                    this.form.get('nationalityId').enable();
                },
                (error: Response) => (this.isRequesting = false),
                () => (this.isRequesting = false)
            );
    }

    /**
     * Constructs payload for request
     * @return payload FormData
     */
    constructRequestPayload(): FormData {
        const payload = new FormData();

        payload.append('employeeId', this.id.toString());

        // Add form fields to FormData
        Object.keys(this.form.value).forEach(key => {
            // Exclude fields with wrong format
            const excludedFields = ['dateOfBirth', 'passportIssueDate', 'passportScan'];

            if (!excludedFields.includes(key)) payload.append(key, this.form.value[key]);
        });

        // Re-add fields with right format
        payload.append('dateOfBirth', this.form.get('dateOfBirth').value.toDateString());
        payload.append('passportIssueDate', this.form.get('passportIssueDate').value.toDateString());

        if (this.form.get('passportScan').value) {
            payload.append(
                'passportScan',
                this.form.get('passportScan').value,
                this.form.get('passportScan').value.name
            );
        }

        return payload;
    }

    /**
     * Submit passport data to server
     * @param payload Form data
     */
    submit() {
        // Mark all form fields as touched to trigger validation
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            this.snackbar.open('В форме содержатся ошибки.');

            return false;
        }

        const payload = {
            ...this.form.value,
            employeeId: this.id
        };

        this.isRequesting = true;
        this.form.disable();

        this.service
            .submit(payload)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    if (this.form.touched) this.snackbar.open('Изменения сохранены.');

                    this.router.navigate(['administration/employees/', this.id], {
                        queryParams: { activeTabIndex: 1 }
                    });
                },
                (error: any) => {
                    this.isRequesting = false;
                    this.form.enable();

                    if (error.status === 400) {
                        error.error.errors.forEach(error => {
                            if (error.code === 1004)
                                this.form.get('passportNumber').setErrors({ duplicatePassportNumber: true });
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
