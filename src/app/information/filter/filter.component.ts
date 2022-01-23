import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { fade } from 'src/app/animations/all';
import { NewsAndInfoService, FetchCriterias, CategoryItemWithContent } from '../information.service';
import * as moment from 'moment-timezone';
import { componentDestroyed } from 'src/app/modules/common/utils';
import { PermissionsService } from 'src/app/modules/authentication/permissions.service';
import { takeUntil } from 'rxjs/operators';

export interface FilterData {
    title?: string;
    onlyActive?: boolean;
    fromDate?: string;
    toDate?: string;
}

@Component({
    selector: 'information-filter',
    templateUrl: './filter.component.html',
    animations: [fade]
})
export class NewsAndInfoFilterComponent implements OnInit, OnDestroy {
    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * List of dictionary-departments for selectbox.
     */
    categories: CategoryItemWithContent[];

    /**
     * Filter form.
     */
    form: FormGroup;

    /**
     * Granted permissions.
     */
    permissions: object;

    /**
     * Set up EventEmmiter to pass filter data up.
     */
    @Output() onFilter = new EventEmitter<FilterData>();
    @Output() onResetFilter = new EventEmitter<boolean>();

    /**
     * Controller name (UsefulLink | News | FileArchive).
     */
    @Input() controllerName: string;

    constructor(
        private snackbar: MatSnackBar,
        private route: ActivatedRoute,
        private service: NewsAndInfoService,
        private fb: FormBuilder,
        private permissionsService: PermissionsService
    ) {
        this.form = this.fb.group({
            title: [''],
            onlyActive: [true],
            fromDate: [''],
            toDate: [''],
            categoryId: ['']
        });
    }

    ngOnInit() {
        this.permissions = this.permissionsService.grantedPermissions;

        Object.keys(this.route.snapshot.queryParams).forEach(key => {
            this.form.get(key).patchValue(this.route.snapshot.queryParams[key]);
            this.form.get(key).markAsDirty();
        });

        this.getCategories();
    }

    /**
     * Get entity categories.
     */
    private getCategories() {
        this.service
            .getCategoriesWithContent(this.controllerName)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.categories = response.data;
            });
    }

    /**
     * Filter by category ID.
     * @param categoryId Category ID.
     */
    filterByCategory(categoryId: number) {
        const control = this.form.get('categoryId');

        control.setValue(categoryId);
        control.markAsDirty();

        this.filter();
    }

    /**
     * Emit filter criterias up
     */
    filter() {
        if (this.form.pristine) {
            this.snackbar.open('Установите параметры фильтрации.');

            return false;
        }

        // TODO: Fix
        const criterias: FetchCriterias = { ...this.form.value };

        Object.keys(this.form.value).forEach(key => {
            if (key === 'fromDate' || key === 'toDate') {
                // @ts-ignore
                criterias[key] = moment(criterias[key]).toDateString();
            }

            if (this.form.get(key).pristine || this.form.get(key).value == '') delete criterias[key];
        });

        this.onFilter.emit(criterias);
    }

    /**
     * Clear form and Emit filter criterias up
     */
    reset() {
        this.form.reset();
        this.onResetFilter.emit(true);
    }

    ngOnDestroy() { }
}
