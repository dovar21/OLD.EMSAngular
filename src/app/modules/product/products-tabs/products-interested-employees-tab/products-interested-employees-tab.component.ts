import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ProductInterestedEmployee, ProductInterestedEmployeeCreate, ProductService } from '../../product.service';
import { MatSlideToggleChange, MatSnackBar } from '@angular/material';
import {
    AdministrationEmployeeService,
    AutocompleteAdministrationEmployee
} from '../../../administration/administration-employee/administration-employee.service';
import { Observable } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { componentDestroyed } from '../../../common/utils';
import { ActivatedRoute } from '@angular/router';

/**
 * ProductInterestedEmployee values and productId
 */
export interface ProductIdAndInterestedEmployees{
    productId: number;
    interestedEmployees: ProductInterestedEmployee[];
}

@Component({
    selector: 'products-interested-employees-tab',
    templateUrl: './products-interested-employees-tab.component.html',
    styleUrls: ['./products-interested-employees-tab.component.sass']
})
export class ProductsInterestedEmployeesTabComponent implements OnChanges, OnDestroy {
    /**
     * Creation form.
     */
    form: FormGroup;

    // -------------------------------------------------------------------------
    // Inputs / Outputs
    // -------------------------------------------------------------------------

    /**
     * Product id
     */
    @Input() productId: number;

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * All interested employees by product id
     */
    productIdAndInterestedEmployees: ProductIdAndInterestedEmployees = {
        productId: null,
        interestedEmployees: []
    };

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * exclude administration-employee
     */
    excludeIds: number[];

    /**
     * List of mathced users when typing into autocomplete field.
     */
    filteredEmployees: Observable<AutocompleteAdministrationEmployee[]>;

    // -------------------------------------------------------------------------
    // Private properties
    // -------------------------------------------------------------------------

    private employees: AutocompleteAdministrationEmployee[];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private productService: ProductService,
                private employeesService: AdministrationEmployeeService,
                private snackbar: MatSnackBar,
                private route: ActivatedRoute,
                private fb: FormBuilder) {

        this.form = this.fb.group({
            employee: ['', Validators.required]
        });
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnChanges(changes: SimpleChanges) {
        if (changes['productId'] && changes['productId'].currentValue) {
            this.route.queryParamMap
                .pipe(takeUntil(componentDestroyed(this)))
                .subscribe(params => {
                    if (params.get('tabs') === 'employees')
                        this.getInterestedEmployees();
                });
        }
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Select employee and save product interested.
     */
    employeeSelect() {
        const employee = this.form.get('employee').value;

        const payload: ProductInterestedEmployeeCreate = {
            employeeId: employee.id
        };

        this.form.disable();
        this.productService
            .addEmployee(this.productId, payload)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    const newSelectedEmployee: ProductInterestedEmployee = {
                        id: employee.id,
                        fullName: employee.fullName,
                        photo: employee.photo,
                        department: employee.department,
                        notifyBySMS: false,
                        notifyByEmail: false
                    };
                    this.snackbar.open(employee.fullName + ' добавлен в список заинтересованных сотрудников.');
                    this.productIdAndInterestedEmployees.interestedEmployees.push(newSelectedEmployee);

                    this.excludeIds.push(employee.id);
                    this.employees = this.employees.filter(employee => employee.id !== employee.id);
                    this.employees = this.employees.filter(employee => !this.excludeIds.includes(employee.id));
                    this.filteredEmployees = this.form.get('employee').valueChanges.pipe(
                        startWith(''),
                        map(value => (typeof value === 'string' ? value : value.fullName)),
                        map(fullName => (fullName ? this.filterEmployeeAutocomplete(fullName) : this.employees.slice()))
                    );

                    this.form = this.fb.group({
                        employee: ['', Validators.required]
                    });
                },
                error => {
                    this.form.enable();
                },
                () => {
                    this.form.enable();
                }
            );
    }

    /**
     * MatAutocomplete display format.
     * @param autocomplete (ProductGroup|Country)
     */
    autocompleteDisplayFn(autocomplete?: any): string {
        return autocomplete.fullName;
    }

    /**
     * Get administration-employee.
     */
    getEmployeesForAutocomplete() {
        this.isRequesting = true;
        this.employeesService
            .getEmployeesAutocomplete()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.employees = response.data;
                    this.employees = this.employees.filter(employee => !this.excludeIds.includes(employee.id));
                    this.filteredEmployees = this.form.get('employee').valueChanges.pipe(
                        startWith(''),
                        map(value => (typeof value === 'string' ? value : value.fullName)),
                        map(fullName => (fullName ? this.filterEmployeeAutocomplete(fullName) : this.employees.slice()))
                    );
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
     * Get administration-employee.
     * @param interestedEmployees remove of product interested employee
     */
    untieEmployee(interestedEmployees: ProductInterestedEmployee) {
        if (this.isRequesting) return;

        this.isRequesting = true;
        const fullName = interestedEmployees.fullName;

        this.productService
            .untieInterestedEmployees(this.productId, interestedEmployees.id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.excludeIds = this.excludeIds.filter(excludeId => excludeId !== interestedEmployees.id);
                this.productIdAndInterestedEmployees.interestedEmployees = this.productIdAndInterestedEmployees.interestedEmployees.filter(
                    interestedEmployee => interestedEmployee.id !== interestedEmployees.id
                );
                this.snackbar.open(fullName + ' удален из списка заинтересованных сотрудников.');
            },
            error => (this.isRequesting = false),
            () => (this.isRequesting = false)
            );
    }

    /**
     * MatAutocomplete display format.
     * @param event Event triggered by changing InterestedEmployees notifyByEmail options
     * @param interestedEmployee select
     * @param notifyBy (Email|SMS)
     */
    toggleInterestedEmployee(event: MatSlideToggleChange, interestedEmployee: ProductInterestedEmployee, notifyBy: string) {
        if (this.isRequesting) return;

        const payload: ProductInterestedEmployeeCreate = {
            employeeId: interestedEmployee.id,
            notifyBySMS: false,
            notifyByEmail: false
        };

        let textSnackbar: string;
        if (notifyBy === 'Email') {
            payload.notifyBySMS = interestedEmployee.notifyBySMS;
            payload.notifyByEmail = event.checked;
            textSnackbar =
                event.checked
                    ? interestedEmployee.fullName + 'будет получать уведомления о товаре по Email.'
                    : interestedEmployee.fullName + 'не будет получать уведомления о товаре по Email.';
        } else {
            payload.notifyByEmail = interestedEmployee.notifyByEmail;
            payload.notifyBySMS = event.checked;
            textSnackbar =
                event.checked
                    ? interestedEmployee.fullName + 'будет получать уведомления о товаре по SMS.'
                    : interestedEmployee.fullName + 'не будет получать уведомления о товаре по SMS.';
        }

        this.isRequesting = true;
        this.productService
            .submitInterestedEmployees(this.productId, payload)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.snackbar.open(textSnackbar);
                },
                error => (this.isRequesting = false),
                () => (this.isRequesting = false)
            );
    }

    // -------------------------------------------------------------------------
    // Private methods
    // -------------------------------------------------------------------------

    /**
     * Get interestedEmployees by product ID.
     */
    private getInterestedEmployees() {
        this.productService
            .getProductInterestedEmployeesByProductId(this.productId)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.productIdAndInterestedEmployees.interestedEmployees = response.data;
                this.excludeIds = this.productIdAndInterestedEmployees.interestedEmployees.map(interestedEmployee => interestedEmployee.id);
            });
    }

    /**
     * Filter users when typing into autocomplete field.
     * @param fullName ProductGroup name.
     */
    private filterEmployeeAutocomplete(fullName: string): any[] {
        const filterValue = fullName.toLowerCase();
        return this.employees.filter(employee => employee.fullName.toLowerCase().includes(filterValue));
    }
}
