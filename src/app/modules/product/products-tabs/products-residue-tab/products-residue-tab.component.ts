import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import {fade} from 'src/app/animations/all';
import { PerRegion, ProductService } from '../../product.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from '../../../common/utils';

@Component({
    selector: 'products-residue-tab',
    templateUrl: './products-residue-tab.component.html',
    styleUrls: ['./products-residue-tab.component.sass'],
    animations: [fade]
})
export class ProductsResidueTabComponent implements OnChanges, OnDestroy {

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

    total: number;
    perRegions: PerRegion[] = [];

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
                    if (params.get('tabs') === 'remains' && !this.perRegions.length)
                        this.getRemains();
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
    private getRemains() {
        this.productService
            .getProductRemains(this.productId)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.total = response.data.total;
                this.perRegions = response.data.perRegion;
            });
    }

}
