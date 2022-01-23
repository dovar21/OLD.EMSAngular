import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { fade } from 'src/app/animations/all';
import { Location } from '@angular/common';
import { filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { componentDestroyed, openDialogLightbox } from 'src/app/modules/common/utils';
import { MatDialog, MatSnackBar, MatTabChangeEvent } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    Counterparty,
    CounterpartyCreate,
    CounterpartyService,
} from '../counterparty.service';
import { PerRegion } from '../../product/product.service';
import { DictionaryCountryAutocomplete, DictionaryCountriesService } from '../../dictionary/dictionary-countries/dictionary-countries.service';
import { Observable, of } from 'rxjs';
import { ConfirmModalDialogComponent } from '../../common/components/confirm-modal/confirm-modal-dialog.component';

@Component({
    selector: 'counterparty-view-component',
    templateUrl: './counterparty-view.component.html',
    styleUrls: ['./counterparty-view.component.sass'],
    animations: [fade]
})
export class CounterpartyViewComponent implements OnInit, OnDestroy {
    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Creation form.
     */
    groupForm: FormGroup;

    /**
     * Counterparty value
     */
    counterparty: Counterparty;

    /**
     * Determines whether any fetch operation is in progress.
     */
    isCounterpartyRequesting: boolean;

    /**
     * PerRegion values
     */
    perRegions: PerRegion[];

    /**
     * List of mathced users when typing into autocomplete field.
     */
    filteredCountries: Observable<DictionaryCountryAutocomplete[]>;

    /**
     * Determines if sidebar is opened.
     */
    isSidebarOpened: boolean;

    /**
     * Active tab index.
     */
    activeTabIndex: number = 0;

    /**
     * Active tab title. Initially set to 'Основные данные' to fetch essential
     * data straight away.
     */
    activeTabLabel = 'Основное';

    /**
     * Product total count.
     */
    total: number;

    /**
     * Put payload counterparty ID.
     */
    payload: CounterpartyCreate = {};

    // -------------------------------------------------------------------------
    // Private properties
    // -------------------------------------------------------------------------

    /**
     * Post ID.
     */
    id: number;

    /**
     *  List of dictionary-countries.
     */
    private countries: DictionaryCountryAutocomplete[];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private counterpartiesService: CounterpartyService,
        private countriesService: DictionaryCountriesService,
        private route: ActivatedRoute,
        private snackbar: MatSnackBar,
        public location: Location,
        private dialog: MatDialog,
        private router: Router,
        private fb: FormBuilder) {

        this.groupForm = this.fb.group({
            name: ['', Validators.required],
            countryName: [''],

            // using in counterparty tab properties
            legalName: [''],
            itn: [''],
            website: [''],
            description: [''],
        });
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.isCounterpartyRequesting = true;
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationStart),
                map(() => this.router),
                takeUntil(componentDestroyed(this))
            )
            .subscribe(event => {
                let oldCounterparty = this.counterparty;
                this.payload.id = this.counterparty.id;

                // update only if change title
                if (this.groupForm.get('name').dirty)
                    this.payload.name = this.groupForm.get('name').value;

                // update only if change shortDescription
                if (this.groupForm.get('countryName').dirty) {
                    const foundCounterpartyCountry = this.countries.find(country => country.name === this.groupForm.get('countryName').value);
                    if (foundCounterpartyCountry) this.payload.countryId = foundCounterpartyCountry.id;
                }

                if (this.groupForm.dirty) {
                    const dialogRef = this.dialog.open(ConfirmModalDialogComponent, {
                        data: { text: 'Вы хотите сохранить изменения?' }
                    });

                    dialogRef.afterClosed()
                        .subscribe((result: boolean) => {
                            if (result) {
                                this.counterpartiesService
                                    .submitCounterparty(this.payload)
                                    .pipe(takeUntil(componentDestroyed(this)))
                                    .subscribe(
                                        response => {
                                            oldCounterparty = response.data;
                                        },
                                        (error: Response) => this.groupForm.enable(),
                                        () => this.snackbar.open(`Изминение успешно сохранено.`)

                                    );
                            } else {
                                this.groupForm.patchValue(this.counterparty);
                            }
                        });
                    this.groupForm.markAsPristine();
                }
            });

        // load all countries for find name counterparty country and using in autocomplete
        this.countriesService
            .getDictionaryCountrySelectItems()
            .pipe(
                takeUntil(componentDestroyed(this)),
                switchMap(response => {
                    this.countries = response.data;
                    // get param for ID
                    return this.route.paramMap.pipe(takeUntil(componentDestroyed(this)));
                }),
                switchMap(params => {
                    this.id = +params.get('id');
                    // Get counterparty by ID.
                    return this.counterpartiesService.getCounterpartyById(this.id).pipe(takeUntil(componentDestroyed(this)));
                }),
                switchMap(response => {
                    this.counterparty = response.data;
                    this.groupForm.patchValue(this.counterparty);

                    this.filteredCountries = this.groupForm.get('countryName').valueChanges.pipe(
                        startWith(''),
                        map(value => (typeof value === 'string' ? value : value.name)),
                        map(name => (name ? this.filterAutocomplete(name) : this.countries.slice()))
                    );

                    this.isCounterpartyRequesting = false;
                    // Update queryParamMap for material tabs
                    return this.route.queryParamMap;
                })
            ).subscribe(params => {
                if (!params.get('tabs')) {
                    this.activeTabLabel = 'Основное';
                    this.activeTabIndex = 0;

                } else if (params.get('tabs') === 'a1') {
                    this.activeTabLabel = 'Реквизиты';
                    this.activeTabIndex = 1;

                } else if (params.get('tabs') === 'stocks') {
                    this.activeTabLabel = 'Накладные';
                    this.activeTabIndex = 2;

                } else if (params.get('tabs') === 'contacts') {
                    this.activeTabLabel = 'Контакты';
                    this.activeTabIndex = 3;

                } else if (params.get('tabs') === 'offices') {
                    this.activeTabLabel = 'Офисы';
                    this.activeTabIndex = 4;
                }
            });
    }

    ngOnDestroy() { }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------
    imageUpdates: any;
    /**
     * Open lightbox with passed photo and name.
     * @param photoPath Photo path.
     * @param fullName Full name.
     */
    openDialogLightbox(photoPath: string, fullName: string, edit: boolean) {

        openDialogLightbox(photoPath, fullName, this.dialog, edit, this.id)
            .pipe(
                switchMap(payload => {
                    return this.counterpartiesService.submitCounterparty(payload);
                }),
                switchMap(() => {
                    openDialogLightbox();
                    return this.counterpartiesService.getCounterpartyById(this.id);
                }
                ),
                takeUntil(componentDestroyed(this))
            )
            .subscribe(response => {
                this.counterparty.imagePathSmall = response.data.imagePathSmall;
                this.counterparty.imagePath = response.data.imagePath;
            })
    }

    /**
     * MatAutocomplete select in object.
     * @param countryName selected country name
     * value number can only be when the type QuantityPerTare
     */
    productPropertiesSelect(countryName: string) {
        if (this.counterparty.countryName === countryName) return;
        const foundCountry = this.countries.find(country => country.name === countryName);
        this.payload.countryId = foundCountry.id;
    }

    /**
     * Catch MatTabGroup tab change
     * @param event Event object
     */
    catchTabChange(event: MatTabChangeEvent) {
        switch (event.tab.textLabel) {
            case 'Основное':
                this.router.navigate([], { queryParams: {} });
                break;

            case 'Реквизиты':
                // if (!this.perRegions) this.getRemains(this.id);
                break;

            case 'Накладные':
                this.router.navigate([], { queryParams: { tabs: 'stocks' } });
                break;

            case 'Контакты':
                this.router.navigate([], { queryParams: { tabs: 'contacts' } });
                break;

            case 'Офисы':
                this.router.navigate([], { queryParams: { tabs: 'offices' } });
                break;
        }

        this.activeTabLabel = event.tab.textLabel;
    }

    /**
     * Validation mat autocomplete
     * @event event change
     */
    validationAutocomplete(event: any) {
        if (event.target.value && event.target.value.length > 0) {
            const foundCountry = this.countries.find(country => country.name === event.target.value);
            if (!foundCountry) this.groupForm.get('countryName').setErrors({ objectNotFound: true });
        }
    }

    // -------------------------------------------------------------------------
    // Private methods
    // -------------------------------------------------------------------------

    /**
     * Filter users when typing into autocomplete field.
     * @param name User name.
     */
    private filterAutocomplete(name: string): DictionaryCountryAutocomplete[] {
        const filterValue = name.toLowerCase();

        return this.countries.filter(country => country.name.toLowerCase().includes(filterValue));
    }
}
