import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';
import { Product, ProductFetchCriterias, ProductService } from '../product.service';
import { ProductCreateComponent } from '../product-create/product-create.component';
import { fade } from 'src/app/animations/all';
import { ProductFilterComponent } from '../product-filter/product-filter.component';
import {
    DictionaryProductGroupsAutocomplete,
    DictionaryProductGroupsService
} from '../../dictionary/dictionary-products-groups/dictionary-product-groups.service';
import {
    DictionaryBrandAutocomplete,
    DictionaryBrandsService
} from '../../dictionary/dictionary-brands/dictionary-brands.service';
import { pipe } from 'rxjs';

@Component({
    selector: 'product-list-component',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.sass'],
    animations: [fade]
})
export class ProductListComponent implements OnInit, OnDestroy {
    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Page title.
     */
    title = this.route.snapshot.data['title'];

    /**
     * Requested entity product with pagination.
     */
    products: Product[] = [];

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Current page number.
     */
    currentPageNumber: number = 1;

    /**
     * Determind if all items were fetched.
     */
    totalCountReached: boolean;

    /**
     * List of productGroups for selectbox
     */
    productGroups: DictionaryProductGroupsAutocomplete[];

    /**
     * List of dictionary-brands for selectbox
     */
    brands: DictionaryBrandAutocomplete[];

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
    private currentQueryParams: ProductFetchCriterias = {};

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private productsGroupsService: DictionaryProductGroupsService,
        private brandsService: DictionaryBrandsService,
        private bottomSheet: MatBottomSheet,
        private service: ProductService,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private router: Router
    ) { }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        // Load all productGroups for transfer to the modal and to the filter list for display.
        this.productsGroupsService
            .getDictionaryProductGroupsSelectListItems()
            .pipe(
                switchMap(response => {
                    this.productGroups = response.data;
                    // Load all dictionary-brands for transfer to the modal and to the filter list for display.
                    return this.brandsService.getDictionaryBrandsSelectListItems();
                }),
                switchMap(response => {
                    this.brands = response.data;
                    return this.route.queryParams;
                }),
                takeUntil(componentDestroyed(this))
            )
            .subscribe(queryParams => {
                this.currentQueryParams = queryParams;
                this.getProducts(queryParams, 'replace');
            });
    }

    ngOnDestroy() { }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Open filter component
     */
    openBottomSheet(): void {
        this.bottomSheet.open(ProductFilterComponent, {
            data: {
                productGroups: this.productGroups,
                brands: this.brands,
            },
            panelClass: 'filter-bottomSheet'
        });
    }

    /**
     * Create or update dictionary sub-values
     */
    openDialogCreate(): void {
        const dialogRef = this.dialog.open(ProductCreateComponent);

        dialogRef
            .afterClosed()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(result => {
                if (result) {
                    if (!this.route.snapshot.queryParams.title &&
                        !this.route.snapshot.queryParams.productGroupId &&
                        !this.route.snapshot.queryParams.brandId) {
                        this.products.unshift(result);
                    } else {
                        this.router.navigate([], { relativeTo: this.route, queryParams: {} });
                    }
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
            this.getProducts({ ...this.currentQueryParams, page: this.currentPageNumber + 1 });
    }

    /**
     * Export given data to file (PDF)
     */
    export() {

    }

    // -------------------------------------------------------------------------
    // Private methods
    // -------------------------------------------------------------------------

    /**
     * Send search criterias to productService and get product
     * list in return
     * @param criterias Fetch criterias for DB searching
     * @param addMethod
     */
    private getProducts(criterias?: ProductFetchCriterias, addMethod: string = 'push') {
        this.isRequesting = true;
        this.service
            .getList(criterias)
            .subscribe(response => {
                if (addMethod === 'push') {
                    this.products.push(...response.data.items);
                } else {
                    this.products = response.data.items;
                }

                this.products.length >= response.data.totalCount
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
