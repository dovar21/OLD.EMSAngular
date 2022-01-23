import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';
import { fade } from 'src/app/animations/all';
import {
    Counterparty,
    CounterpartyFetchCriterias,
    CounterpartyService
} from '../counterparty.service';
import { FetchCriterias } from '../../../information/information.service';
import { CounterpartyCreateComponent } from '../counterparty-create/counterparty-create.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CounterpartyFilterComponent } from '../counterparty-filter/counterparty-filter.component';
import {
    DictionaryCountryAutocomplete,
    DictionaryCountriesService
} from '../../dictionary/dictionary-countries/dictionary-countries.service';

@Component({
    selector: 'counterparty-list-component',
    templateUrl: './counterparty-list.component.html',
    styleUrls: ['./counterparty-list.component.sass'],
    animations: [fade]
})
export class CounterpartyListComponent implements OnInit, OnDestroy {
    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------
    /**
     * Page title.
     */
    title = this.route.snapshot.data['title'];

    /**
     * Requested entity counterparty with pagination.
     */
    counterparties: Counterparty[] = [];

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Current page number.
     */
    currentPageNumber = 1;

    /**
     * Determind if all items were fetched.
     */
    totalCountReached: boolean;

    /**
     * List of DictionaryCountryAutocomplete for selectbox
     */
    countries: DictionaryCountryAutocomplete[];

    /**
     * If component load after shown filter
     */
    isComponentLoad: boolean;

    // -------------------------------------------------------------------------
    // Private properties
    // -------------------------------------------------------------------------

    /**
     * Current filter param.
     */
    private currentQueryParams: FetchCriterias = {};

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private bottomSheet: MatBottomSheet,
                private service: CounterpartyService,
                private countriesService: DictionaryCountriesService,
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private router: Router) {
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        // Load all countries for transfer to the modal and to the filter list for display.
        this.countriesService
            .getDictionaryCountrySelectItems()
            .pipe(
                takeUntil(componentDestroyed(this)),
                switchMap(response => {
                    this.countries = response.data;
                    // get queryParams for load counterparties
                    return this.route.queryParams;
                })
            )
            .subscribe(queryParams => {
                this.currentQueryParams = queryParams;
                // load counterparties
                this.getCounterparties(queryParams, 'replace');
            });
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Open filter component
     */
    openBottomSheet(): void {
        this.bottomSheet.open(CounterpartyFilterComponent, {
            data: this.countries,
            panelClass: 'filter-bottomSheet'
        });
    }

    /**
     * Create or update dictionary sub-values
     */
    openDialogCreate(): void {
        const dialogRef = this.dialog.open(CounterpartyCreateComponent, {
            panelClass: 'full-width-dialog'
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(result => {
                if (result === 'submit') {
                    this.getCounterparties();
                }
            });
    }

    /**
     * Set selected paginator options as query params
     */
    setPaginationQueryParams() {
        if (!this.totalCountReached) {
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {
                    page: this.route.snapshot.queryParams.page ? +this.route.snapshot.queryParams.page + 1 : 2
                },
                queryParamsHandling: 'merge'
            });
        }
    }

    /**
     * Load more to list.
     */
    loadMore() {
        if (!this.totalCountReached)
            this.getCounterparties({ ...this.currentQueryParams, page: this.currentPageNumber + 1 });
    }

    /**
     * Export given data to file (PDF)
     */
    export() {}

    // -------------------------------------------------------------------------
    // Private methods
    // -------------------------------------------------------------------------

    /**
     * Send search criterias to counterpartsService and get counterparty
     * list in return
     * @param criterias Fetch criterias for DB searching
     * @param addMethod
     */
    private getCounterparties(criterias?: CounterpartyFetchCriterias, addMethod: string = 'push') {
        this.isRequesting = true;
        this.service
            .getList(criterias)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    if (addMethod === 'push') {
                        this.counterparties.push(...response.data.items);
                    } else {
                        this.counterparties = response.data.items;
                    }

                    this.counterparties.length >= response.data.totalCount
                        ? (this.totalCountReached = true)
                        : (this.totalCountReached = false);

                    this.isComponentLoad = true;
                },
                (error: Response) => (this.isRequesting = false),
                () => {
                    this.isRequesting = false;
                });
    }
}
