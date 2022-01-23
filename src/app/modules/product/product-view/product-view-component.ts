import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { fade } from 'src/app/animations/all';
import { Location } from '@angular/common';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';
import {
    PerRegion,
    Product,
    ProductCreate,
    ProductInterestedEmployee,
    ProductService,
    Promo
} from '../product.service';
import { MatDialog, MatSnackBar, MatTabChangeEvent } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmModalDialogComponent } from '../../common/components/confirm-modal/confirm-modal-dialog.component';

@Component({
    selector: 'product-view-component',
    templateUrl: './product-view.component.html',
    styleUrls: ['./product-view.component.sass'],
    animations: [fade]
})
export class ProductViewComponent implements OnInit, OnDestroy {
    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Creation form.
     */
    groupForm: FormGroup;

    /**
     * Product title
     *
     */
    originalTitle: string;

    /**
     * Product shortDescription
     *
     */
    originalShortDescription: string;

    /**
     * Product value
     */
    product: Product;

    /**
     * PerRegion values
     */
    perRegions: PerRegion[];

    /**
     * Promo values
     */
    promos: Promo[];

    /**
     * InterestedEmployees values
     */
    interestedEmployees: ProductInterestedEmployee[];

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
    activeTabLabel = 'Основные данные';

    /**
     * Product total count.
     */
    total: number;

    /**
     * Put payload by product ID
     */
    payload: ProductCreate = {};

    // -------------------------------------------------------------------------
    // Private properties
    // -------------------------------------------------------------------------

    /**
     * producct ID
     */
    private id: number;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private productService: ProductService,
                private route: ActivatedRoute,
                private snackbar: MatSnackBar,
                public location: Location,
                private dialog: MatDialog,
                private fb: FormBuilder,
                private router: Router) {

        this.groupForm = this.fb.group({
            title: ['', Validators.required],
            shortDescription: ['', Validators.required],
            // using in product tab properties
            productGroup: [''],
            countryOfOrigin: [''],
            brand: [''],
            unit: [''],
            tare: [''],
            quantityPerTare: [''],
            // using in product implementation
            barcode: [''],
            warehouseMinQuantity: [''],
            retailPrice: [''],
            wholesalePrice: [''],
            minWholesaleSellQuantity: [''],
            ignoreDiscounts: [false],
            isAvailableInShops: [false],
            isAvailableForWholesale: [false],
            isVisibleOnSite: [false],
            // using in product description
            description: ['']
        });
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationStart),
                map(() => this.router),
                takeUntil(componentDestroyed(this))
            )
            .subscribe(event => {
                let oldProduct = this.product;
                this.payload.id = this.product.id;

                // update only if change title
                if (this.groupForm.get('title').dirty)
                    this.payload.title = this.groupForm.get('title').value;

                // update only if change shortDescription
                if (this.groupForm.get('shortDescription').dirty)
                    this.payload.shortDescription = this.groupForm.get('shortDescription').value;

                if (this.groupForm.dirty) {
                    const dialogRef = this.dialog.open(ConfirmModalDialogComponent, {
                        data: { text: 'Вы хотите сохранить изменения?' }
                    });

                    dialogRef.afterClosed()
                        .subscribe((result: boolean) => {
                            if (result) {
                                this.productService
                                    .submitProductGroup(this.payload)
                                    .pipe(takeUntil(componentDestroyed(this)))
                                    .subscribe(
                                        response => {
                                            oldProduct = response.data;
                                        },
                                        (error: Response) => this.groupForm.enable(),
                                        () => this.snackbar.open(`Изминение успешно сохранено.`)

                                    );
                            } else {
                                this.groupForm.patchValue(this.product);
                            }
                        });
                    this.groupForm.markAsPristine();
                }
            });

        this.route.paramMap
            .pipe(
                takeUntil(componentDestroyed(this)),
                switchMap(params => {
                    this.id = +params.get('id');
                    // Get product by ID.
                    return this.productService.getProductById(this.id).pipe(takeUntil(componentDestroyed(this)));
                }),
                switchMap(response => {
                    this.product = response.data;
                    this.groupForm.patchValue({
                        title: this.product.title,
                        shortDescription: this.product.shortDescription,
                    });

                    return this.route.queryParamMap;
                })
            ).subscribe(params => {
                // Update queryParamMap for material tabs
                if (!params.get('tabs')) {
                    this.activeTabLabel = 'Основные данные';
                    this.activeTabIndex = 0;

                } else if (params.get('tabs') === 'remains') {
                    this.activeTabLabel = 'Остатки';
                    this.activeTabIndex = 1;

                } else if (params.get('tabs') === 'analogs') {
                    this.activeTabLabel = 'Аналоги';
                    this.activeTabIndex = 2;

                } else if (params.get('tabs') === 'stocks') {
                    this.activeTabLabel = 'Акции';
                    this.activeTabIndex = 3;

                } else if (params.get('tabs') === 'employees') {
                    this.activeTabLabel = 'Заинтересованные лица';
                    this.activeTabIndex = 4;
                }
            });
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Catch MatTabGroup tab change
     * @param event Event object
     */
    catchTabChange(event: MatTabChangeEvent) {
        switch (event.tab.textLabel) {
            case 'Основные данные':
                this.router.navigate([], { queryParams: {} });
                break;

            case 'Остатки':
                this.router.navigate([], { queryParams: { tabs: 'remains' } });
                break;

            case 'Аналоги':
                this.router.navigate([], { queryParams: { tabs: 'analogs' } });
                break;

            case 'Акции':
                this.router.navigate([], { queryParams: { tabs: 'stocks' } });
                break;

            case 'Заинтересованные лица':
                this.router.navigate([], { queryParams: { tabs: 'employees' } });
                break;
        }

        this.activeTabLabel = event.tab.textLabel;
    }
}
