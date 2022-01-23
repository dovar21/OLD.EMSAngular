import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FetchCriterias } from '../mail.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment-timezone';
import { MIN_DATE } from 'src/app/app.config';
import { MatSnackBar } from '@angular/material';
import { isEmptyObject, componentDestroyed } from 'src/app/modules/common/utils';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'messages-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.sass']
})
export class FilterComponent implements OnInit, OnDestroy {
    /**
     * Filter form.
     */
    form: FormGroup;

    /**
     * Minimum date available for filtering.
     */
    minDate: moment.Moment = MIN_DATE;

    /**
     * Maximum date available for filtering.
     */
    maxDate: moment.Moment = moment();

    /**
     * Fires on filter.
     */
    @Output() onFilter: EventEmitter<FetchCriterias> = new EventEmitter();

    /**
     * Fires on resetting filter.
     */
    @Output() onResetFilter: EventEmitter<any> = new EventEmitter();

    constructor(private fb: FormBuilder, private snackbar: MatSnackBar) {
        this.form = fb.group({
            fromDate: fb.control(''),
            toDate: fb.control('')
        });
    }

    ngOnInit(): void {
        this.form
            .get('fromDate')
            .valueChanges.pipe(takeUntil(componentDestroyed(this)))
            .subscribe(value => (this.minDate = value));
    }

    filter() {
        let query: FetchCriterias = this.form.value;

        Object.keys(query).filter(key => {
            if (query[key] === '' || query[key] === null) delete query[key];
        });

        if (isEmptyObject(query)) {
            this.snackbar.open('Установите параметры фильтрации.');

            return false;
        }

        // @ts-ignore
        if (query.fromDate) query = { ...query, fromDate: moment(query.fromDate).toDateString() };
        // @ts-ignore
        if (query.toDate) query = { ...query, toDate: moment(query.toDate).toDateString() };

        this.onFilter.emit(query);
    }

    resetFilter() {
        this.form.reset();
        this.onResetFilter.emit({});
    }

    ngOnDestroy() {}
}
