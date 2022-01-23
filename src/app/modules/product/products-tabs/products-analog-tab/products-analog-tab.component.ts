import { Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import {
    AutocompleteAnalog,
    ProductAnalogs,
    ProductAnalogsCreate,
    ProductAnalogsFetchCriterias,
    ProductService
} from '../../product.service';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { componentDestroyed } from '../../../common/utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatSnackBar, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
    selector: 'products-analog-tab',
    templateUrl: './products-analog-tab.component.html',
    styleUrls: ['./products-analog-tab.component.sass'],
})
export class ProductsAnalogTabComponent implements OnChanges, OnDestroy {
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
    @Input()
    productId: number;

    // -------------------------------------------------------------------------
    // ViewChild
    // -------------------------------------------------------------------------

    @ViewChild(MatSort, { static: true }) sort: MatSort;

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * ProductAnalogs for MatTableDataSource
     */
    analogs: ProductAnalogs[];

    /**
     * ProductAnalogs values
     */
    analogsList = new MatTableDataSource(this.analogs);

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequestingAutocomplete: boolean;

    /**
     * exclude analogs
     */
    excludeIds: number[];

    /**
     * Columns to display in the table ProductAnalogs.
     */
    displayedColumns: string[] = [
        'image',
        'title',
        'shortDescription',
        'countryOfOrigin',
        'retailPrice',
        'wholesalePrice',
        'untie'
    ];

    /**
     * List of mathced users when typing into autocomplete field.
     */
    filteredAnalogs: Observable<AutocompleteAnalog[]>;

    // -------------------------------------------------------------------------
    // Private properties
    // -------------------------------------------------------------------------

    private analogsForAutocomplete: AutocompleteAnalog[];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private productService: ProductService,
                private route: ActivatedRoute,
                private snackbar: MatSnackBar,
                private fb: FormBuilder,
                private router: Router) {

        this.form = this.fb.group({
            // analog: ['', Validators.required]
            analog: ['']
        });
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnChanges(changes: SimpleChanges) {
        if (changes['productId'] && changes['productId'].currentValue) {
            this.route.queryParams
                .pipe(takeUntil(componentDestroyed(this)))
                .subscribe(params => {
                    if (params.tabs === 'analogs') this.getAnalogs(params);
                });
        }
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Select analog and save.
     */
    analogSelect() {
        const selectAnalog = this.form.get('analog').value;
        const payload: ProductAnalogsCreate = { analogId: selectAnalog.id };
        this.form.disable();
        this.productService
            .addProductAnalog(this.productId, payload)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.snackbar.open(`Товар "${response.data.title}" добавлен в список аналогов.`);
                    this.analogsList.data = [...this.analogsList.data, response.data];
                    this.excludeIds.push(payload.analogId);
                    this.analogsForAutocomplete = this.analogsForAutocomplete.filter(
                        analogsForAutocomplete => analogsForAutocomplete.id !== payload.analogId
                    );
                    this.analogsForAutocomplete = this.analogsForAutocomplete.filter(
                        analogForAutocomplete => !this.excludeIds.includes(analogForAutocomplete.id)
                    );
                    this.filteredAnalogs = this.form.get('analog').valueChanges.pipe(
                        startWith(''),
                        map(value => (typeof value === 'string' ? value : value.title)),
                        map(title =>
                            title ? this.filterAnalogAutocomplete(title) : this.analogsForAutocomplete.slice()
                        )
                    );
                    this.form = this.fb.group({
                        analog: ['', Validators.required]
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
     * Get analogs.
     */
    getAnalogsFromAutocomplete() {
        this.isRequestingAutocomplete = true;
        this.productService
            .getProductAnalogsAutocomplete()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.analogsForAutocomplete = response.data;
                    this.analogsForAutocomplete = this.analogsForAutocomplete.filter(
                        analogForAutocomplete => !this.excludeIds.includes(analogForAutocomplete.id)
                    );

                    this.filteredAnalogs = this.form.get('analog').valueChanges.pipe(
                        startWith(''),
                        map(value => (typeof value === 'string' ? value : value.title)),
                        map(title =>
                            title ? this.filterAnalogAutocomplete(title) : this.analogsForAutocomplete.slice()
                        )
                    );
                },
                error => {
                    this.isRequestingAutocomplete = false;
                    this.form.enable();
                },
                () => {
                    this.isRequestingAutocomplete = false;
                    this.form.enable();
                }
            );
    }

    /**
     * untie analog of product
     * @param selectAnalog
     */
    untieAnalog(selectAnalog: ProductAnalogs) {
        if (this.isRequesting) return;

        this.isRequesting = true;
        const title = selectAnalog.title;
        this.productService
            .getUntieAnalogsByProductId(this.productId, selectAnalog.id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.excludeIds = this.excludeIds.filter(excludeId => excludeId !== selectAnalog.id);
                    this.analogsList.data = this.analogsList.data.filter(analog => analog.id !== selectAnalog.id);
                    this.snackbar.open(`Товар "${title}" удален из списка аналогов.`);
                },
                error => {
                    this.isRequesting = false;
                },
                () => {
                    this.isRequesting = false;
                }
            );
    }

    /**
     * MatAutocomplete display format.
     * @param autocomplete (ProductGroup|Country)
     */
    autocompleteDisplayFn(autocomplete?: any): string {
        return autocomplete.title;
    }

    /**
     * Set query params based on sorting values.
     * @param event Standard MatSort event.
     */
    setSortingQueryParams(event: Sort) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { sortProperty: event.active, sortDir: event.direction },
            queryParamsHandling: 'merge'
        });
    }

    // -------------------------------------------------------------------------
    // Private methods
    // -------------------------------------------------------------------------

    /**
     * Get analogs by product ID.
     */
    private getAnalogs(params: Params) {
        this.isRequesting = true;
        const productAnalogsFetchCriterias: ProductAnalogsFetchCriterias = {
            sortProperty: params.sortProperty,
            sortDir: params.sortDir,
        };

        this.productService
            .getProductAnalogsEntries(this.productId, productAnalogsFetchCriterias)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.analogsList.data = response.data;
                    this.excludeIds = [...this.analogsList.data.map(analogList => analogList.id), this.productId];
                },
                (error: Response) => (this.isRequesting = false),
                () => {
                    this.analogsList.sort = this.sort;
                    this.isRequesting = false;
                });
    }

    /**
     * Filter users when typing into autocomplete field.
     * @param title ProductGroup name.
     */
    private filterAnalogAutocomplete(title: string): any[] {
        const filterValue = title.toLowerCase();
        return this.analogsForAutocomplete.filter(analog => analog.title.toLowerCase().includes(filterValue));
    }
}
