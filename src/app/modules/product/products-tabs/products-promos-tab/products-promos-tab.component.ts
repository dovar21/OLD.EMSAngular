import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { fade } from 'src/app/animations/all';
import { ProductService, Promo } from '../../product.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from '../../../common/utils';

@Component({
    selector: 'products-promos-tab',
    templateUrl: './products-promos-tab.component.html',
    styleUrls: ['./products-promos-tab.component.sass'],
    animations: [fade]
})
export class ProductsPromosTabComponent implements OnChanges, OnDestroy {
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
     * promos
     */
    promos: Promo[];

    /**
     * Columns to display in the table Stocks.
     */
    displayedStocksColumns: string[] = [
        'name',
        'discountAmount',
        'startDate',
        'endDate',
        'isWholesaleSale',
        'isRetailSale'
    ];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private productService: ProductService,
                private route: ActivatedRoute) {
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnChanges(changes: SimpleChanges) {
        if (changes['productId'] && changes['productId'].currentValue) {
            this.route.queryParamMap
                .pipe(takeUntil(componentDestroyed(this)))
                .subscribe(params => {
                    if (params.get('tabs') === 'stocks' && !this.getStocks.length)
                        this.getStocks();
                });
        }
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Private methods
    // -------------------------------------------------------------------------

    /**
     * Get remains by product ID.
     */
    private getStocks() {
        this.productService
            .getProductStocksEntries(this.productId)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => (this.promos = response.data));
    }

}
