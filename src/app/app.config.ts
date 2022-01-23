import * as moment from 'moment-timezone';
import { momentX } from './modules/common/utils';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MatDialogConfig } from '@angular/material';

interface Moment extends moment.Moment {}

/**
 * Custom moment method for returning date as string.
 */
// @ts-ignore
moment.fn.toDateString = function() {
    return this.format('DD.MM.YYYY');
};

/**
 * An array of numbers to show on one page.
 */
export const PAGE_SIZE_OPTIONS: number[] = [20, 50, 100];

/**
 * Minimum date available to choose from MatDatePicker.
 */
export const MIN_DATE: moment.Moment = momentX('01.01.1900');

/**
 * The minimum age of employee that can be hired.
 */
export const ADULT_DATE: moment.Moment = moment().subtract(18, 'years');

/**
 * Ngx-perfect-scrollbar config
 */
export const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {};

/**
 * MatDialog config
 */
export const MAT_DIALOG_GLOBAL_OPTIONS: MatDialogConfig<any> = {
    maxWidth: '400px',
    hasBackdrop: true,
    panelClass: 'position-relative',
    closeOnNavigation: true
};

/**
 * Custom date format for material components such as
 * MatDatePicker.
 */
export const CUSTOM_MAT_DATE_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY'
    },
    display: {
        dateInput: 'DD.MM.YYYY',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'DD',
        monthYearA11yLabel: 'MMMM YYYY'
    }
};

/**
 * MatSnackbar options.
 */
export const MAT_SNACK_BAR_OPTIONS = {
    duration: 5000,
    panelClass: 'text-center'
};

/**
 * Regular expressions for validation.
 */
export const REGEXP = {
    URL: '^(http://www.|https://www.|http://|https://)?[a-zA-Zа-яА-я0-9]+([-.]{1}[a-zA-Zа-яА-Я]+)*.*$',
    EMAIL:
        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
    CYR_LETTERS: '[а-яА-Я]*',
    DIGITS: '^[0-9]*$'
};

/**s
 * CKEditor5 config.
 */
export const CKEDITOR_CONFIG = {
    defaultLanguage: 'ru',
    language: 'ru'
};
