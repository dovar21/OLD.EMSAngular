import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AdministrationEmployeeCreateUpdateService } from './administration-employee-create-update.service';
import { Location } from '@angular/common';
import { Gender, GendersService } from 'src/app/modules/common/services/genders.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment-timezone';
import { ADULT_DATE, MIN_DATE, REGEXP } from 'src/app/app.config';
import { fade } from 'src/app/animations/all';
import { componentDestroyed, removeNullFromObject } from 'src/app/modules/common/utils';
import { VALIDATION_ERRORS } from 'src/app/modules/common/lexicon/ru/validation-dictionary';
import { takeUntil } from 'rxjs/operators';
import { AutocompleteDepartment, DictionaryDepartmentsService } from '../../../dictionary/dictionary-departments/dictionary-departments.service';
import { DictionaryPositionsAutocomplete, DictionaryPositionsService } from '../../../dictionary/dictionary-positions/dictionary-positions.service';
import { AdministrationEmployeeService, AdministrationEmployeeEssentialData } from '../administration-employee.service';

// @ts-ignore
@Component({
    selector: 'administration-employee-create-update',
    templateUrl: './administration-employee-create-update.component.html',
    styleUrls: ['./administration-employee-create-update.component.sass'],
    animations: [fade]
})
export class CreateEmployeeComponent implements OnInit, OnDestroy {

    /**
    * Uploaded image by input
    */
    uploadedImage: FileList;
    /**
     * Shown cropping True || False
     */
    croppingMode: boolean;

    /**
     * Image select
     */
    imagePreview: string;

    /**
     * Page title
     */
    title: string;

    /**
     * Указывать залочен ли сотрудник
     */
    isEmployeeLocked: string;

    /**
     * Minimum date available to choose from MatDatePicker
     */
    minDate = MIN_DATE;

    /**
     * Current date
     */
    today = moment();

    /**
     * The max date to show in MatDate picker for age
     */
    aultDate = ADULT_DATE;

    /**
     * ID of current administration-employee-view. If has value, then we're updating an
     * administration-employee-view, otherwise – creating
     */
    id: number;

    /**
     * The existing administration-employee-view data that gets populated to form if we're
     * updating administration-employee-view
     */
    essentialData: AdministrationEmployeeEssentialData;

    /**
     * List of dictionary-departments for selectbox
     */
    departments: AutocompleteDepartment[];

    /**
     * List of dictionary-positions for selectbox
     */
    positions: DictionaryPositionsAutocomplete[];

    /**
     * List of genders for selectbox
     */
    genders: Gender[];

    /**
     * An object with all validation erros.
     */
    validationErrors = VALIDATION_ERRORS;

    /**
     * Register form.
     */
    form: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private snackbar: MatSnackBar,
        private departmentsService: DictionaryDepartmentsService,
        private positionsService: DictionaryPositionsService,
        private service: AdministrationEmployeeCreateUpdateService,
        public location: Location,
        private gendersService: GendersService,
        private employeesService: AdministrationEmployeeService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            photo: '',
            lastName: ['', [Validators.required, Validators.pattern(REGEXP.CYR_LETTERS)]],
            firstName: ['', [Validators.required, Validators.pattern(REGEXP.CYR_LETTERS)]],
            middleName: ['', Validators.pattern(REGEXP.CYR_LETTERS)],
            dateOfBirth: '',
            genderId: ['1'],
            hireDate: '',
            departmentId: '',
            positionId: '',
            phone: [
                '',
                [
                    Validators.required,
                    Validators.minLength(9),
                    Validators.maxLength(9),
                    Validators.pattern(REGEXP.DIGITS)
                ]
            ],
            email: ['', Validators.pattern(REGEXP.EMAIL)],
            factualAddress: ['', Validators.required],
            description: ''
        });
    }


    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------


    ngOnInit() {
        // Get and assign administration-employee-view ID if we want to update his data
        this.route.paramMap.pipe(takeUntil(componentDestroyed(this))).subscribe(params => (this.id = +params.get('id')));

        // Fetch and assign nesessary data for select boxes
        this.getDepartments();
        this.getGenders();

        if (this.id) {
            this.title = 'Редактирование сотрудника';
            this.getEssentialData(this.id);
        } else this.title = 'Добавление сотрудника';
    }


    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Renders selected image to given img tag and assigns it to respective
     * form field
     * @param files Files object
     */
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
        this.form.get('photo').patchValue(image);
        this.croppingMode = false;
        if (image) this.imagePreview = image;
    }

    /**
     * Get essential data and populate to form
     * @param id AdministrationEmployee ID
     */
    getEssentialData(id: number) {
        this.employeesService
            .getEssentialData(id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.essentialData = response.data;
                    this.isEmployeeLocked = response.data.lockDate;

                    this.form.patchValue({
                        ...removeNullFromObject(response.data),
                        dateOfBirth: moment(response.data.dateOfBirth),
                        hireDate: moment(response.data.hireDate),
                        genderId: response.data.genderId.toString()
                    });

                    if (this.essentialData.photoPath)
                        this.imagePreview = this.essentialData.photoPath;

                    this.getPositions(response.data.departmentId);

                    // Navigate back thus diasable updating in case of administration-employee-view
                    // is locked.
                    if (this.essentialData.lockDate) this.location.back();
                },
                (error: Response) => this.location.back()
            );
    }

    /**
     * Get all genders
     */
    getGenders() {
        this.gendersService
            .get()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => (this.genders = response.data));
    }

    /**
     * Get all dictionary-departments
     */
    getDepartments() {
        this.departmentsService
            .getDepartmentsSelectItems()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => (this.departments = response.data));
    }

    /**
     * Get all dictionary-positions of passed department
     * @param departmentId Department ID
     */
    getPositions(departmentId: number) {
        this.form.get('positionId').disable();
        this.positionsService
            .getDictionaryPositionsByDepartmentIdSelectListItems(departmentId)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => (this.positions = response.data),
                error => this.form.get('positionId').enable(),
                () => this.form.get('positionId').enable()
            );
    }

    // TODO: Don't know what does this do. Fix.
    getPositionsStrategy() {
        if (!this.id) this.getPositions(this.form.get('departmentId').value);
    }

    /**
     * Create administration-employee-view or update it's data.
     * @param redirectTo Where to redirect after submit (create || profile)
     * @param formDirective Referance to form directive for clearing it.
     */
    submit(redirectTo: string, formDirective: FormGroupDirective) {
        // Mark all form fields as touched to trigger validation
        this.form.markAllAsTouched();

        // Don't submit if form has errors
        if (this.form.invalid) {
            this.snackbar.open('В форме содержатся ошибки');
            return false;
        }

        let action = 'Create';

        const payload = {
            ...this.form.value,
            genderId: +this.form.get('genderId').value
        }

        if (this.id) {
            action = 'Edit';
            payload.id = this.id
        }

        this.form.disable();

        this.service
            .submit(action, payload)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    switch (action) {
                        case 'Create':
                            this.snackbar.open('Сотрудник успешно добавлен');
                            console.log('CREated and Redirected' + redirectTo, formDirective);
                            this.redirect(redirectTo, formDirective, response.data.id);
                            break;

                        case 'Edit':
                            this.router.navigate(['/administration/employees', this.id]);
                            if (this.form.touched) this.snackbar.open('Изменения сохранены.');
                            break;
                    }
                },
                (error: any) => {
                    this.form.enable();

                    if (error.status === 400) {
                        error.error.errors.forEach(error => {
                            switch (error.code) {
                                case 1002:
                                    this.form.get('email').setErrors({ duplicateEmail: true });
                                    break;

                                case 1003:
                                    this.form.get('phone').setErrors({ duplicatePhone: true });
                                    break;
                            }
                        });
                    }
                },
                () => this.form.enable()
            );
    }

    /**
     * Handle redirection logic after form submit.
     * @param redirectTo Where to redirect after submit (create || profile)
     * @param formDirective Referance to form directive for clearing it.
     */
    redirect(redirectTo: string, formDirective: FormGroupDirective, id: number) {
        switch (redirectTo) {
            case 'profile':
                this.router.navigate(['/administration/employees', id]);
                break;

            case 'create':
                formDirective.resetForm();
                this.form.reset();
                break;
        }
    }

    ngOnDestroy() { }
}
