import { DictionaryStatusesService, DictionaryStatusAutocomplete } from './../../../dictionary/dictionary-statuses/dictionary-statuses.service';
import { CounterpartyWaybillsFilterComponent } from './counterparty-waybills-filter/counterparty-waybills-filter.component';
import { takeUntil, switchMap } from 'rxjs/operators';
import { componentDestroyed, removeNullFromObject } from 'src/app/modules/common/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { CounterpartyService, CounterpartyWaybillsFetchCriteries } from './../../counterparty.service';
import { Component, Input, OnInit } from '@angular/core';
import { CounterpartyWaybills } from '../../counterparty.service';
import { MatBottomSheet, PageEvent, Sort } from '@angular/material';
import { detailExpand, fade } from 'src/app/animations/all';

@Component({
    selector: 'counterparty-waybills-tab',
    templateUrl: './counterparty-waybills-tab.component.html',
    styleUrls: ['./counterparty-waybills-tab.component.sass'],
    animations: [fade, detailExpand]
})
export class CounterpartyWaybillsTabComponent implements OnInit {
    // -------------------------------------------------------------------------
    // Inputs / Outputs
    // -------------------------------------------------------------------------

    /**
     * CounterpartyContact values.
     */
    @Input()
    counterpartyId: number;

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * CounterpartyOffieces values
     */
    counterpartWaybills: CounterpartyWaybills[];

    /**
     * Status of waybills
     */
    waybillStatus: DictionaryStatusAutocomplete[];
    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * An array of columns to display in the table.
     */
    displayedColumns: string[] = [
        'number',
        'date',
        'typeName',
        'productsCount',
        'totalSum',
        'balance',
        'statusName',
        'createdBy',
        'actions'
    ];

    /**
     * An array of numbers to show on one page.
     */
    pageSizeOptions = [20, 50, 100];

    /**
     * Page number.
     */
    pageIndex: number;

    /**
     * Number of dictionary-departments to show on one page.
     */
    pageSize: number;

    /**
     * En event that fires when user interacts with MatPaginator.
     * Contains paginator controls' values.
     */
    pageEvent: PageEvent;

    /**
     * Object of criterias collected from paginator and filter
     * to be sent to API.
     */
    fetchCriterias: CounterpartyWaybillsFetchCriteries;

    /**
     * If component load after shown filter
     */
    isComponentLoaded: boolean;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(
        private counterpartiesService: CounterpartyService,
        private route: ActivatedRoute,
        private router: Router,
        private bottomSheet: MatBottomSheet,
        private dictionaryService: DictionaryStatusesService
    ) { }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        // Set paginator values if department navigated from paginated link
        this.pageIndex = +this.route.snapshot.queryParams.page - 1;
        this.pageSize = +this.route.snapshot.queryParams.pageSize;

        this.dictionaryService
            .getDictionaryStatusesSelectListItems()
            .pipe(
                switchMap(response => {
                    this.waybillStatus = response.data;
                    return this.route.queryParams
                }),
                switchMap(params => {
                    return this.counterpartiesService
                        .getCounterpartyWaybillsList(this.counterpartyId, removeNullFromObject(params))
                }),
                takeUntil(componentDestroyed(this))
            )
            .subscribe(response => {
                this.counterpartWaybills = response.data;
                this.isComponentLoaded = true;
            })
    }

    ngOnDestroy() { }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Open filter component
     */
    openBottomSheet(): void {
        this.bottomSheet.open(CounterpartyWaybillsFilterComponent, {
            data: this.waybillStatus,
            panelClass: 'filter-bottomSheet'
        });
    }

    /**
     * Set selected paginator options as query params
     * @param event Event triggered by changing pagination options
     */
    setPaginationQueryParams(event: PageEvent) {
        const { pageIndex, pageSize } = event;

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                page: pageIndex + 1, // TODO: Configure MatPaginator pageIndex to start from 1
                pageSize
            },
            queryParamsHandling: 'merge'
        });
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
}
