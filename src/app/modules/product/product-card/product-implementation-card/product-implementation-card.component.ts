import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { fade } from 'src/app/animations/all';
import { Product, ProductCreate } from '../../product.service';
import { FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material';

@Component({
    selector: 'product-implementation-card',
    templateUrl: './product-implementation-card.component.html',
    styleUrls: ['./product-implementation-card.component.sass'],
    animations: [fade]
})
export class ProductImplementationCardComponent implements OnChanges, OnDestroy {
    // -------------------------------------------------------------------------
    // Inputs / Outputs
    // -------------------------------------------------------------------------

    /**
     * Product which we look
     */
    @Input() product: Product;

    /**
     * Creation form.
     */
    @Input() groupForm: FormGroup;

    /**
     * Put payload by product ID
     */
    @Input() payload: ProductCreate;

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnChanges(changes: SimpleChanges) {
        if (changes['product'] && changes['product'].currentValue)
            this.groupForm.patchValue(this.product);
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * General method for saving a modified field
     * @param event Event object.
     * @param type to determine where has been changed ('ignoreDiscounts'|'isAvailableInShops'|'isAvailableForWholesale'|'isVisibleOnSite')
     */
    toggle(event: MatSlideToggleChange, type: 'ignoreDiscounts'|'isAvailableInShops'|'isAvailableForWholesale'|'isVisibleOnSite') {
        switch (type) {
            case 'ignoreDiscounts':
                this.payload.ignoreDiscounts = event.checked;
                break;

            case 'isAvailableInShops':
                this.payload.isAvailableInShops = event.checked;
                break;

            case 'isAvailableForWholesale':
                this.payload.isAvailableForWholesale = event.checked;
                break;

            case 'isVisibleOnSite':
                this.payload.isVisibleOnSite = event.checked;
                break;
        }
    }

    /**
     * General method for saving a modified field
     */
    onBlurMethod(type: string) {
        if (type === 'barcode') {
            this.payload.barcode = this.groupForm.get('barcode').value;
        } else if (type === 'warehouseMinQuantity') {
            this.payload.warehouseMinQuantity = this.groupForm.get('warehouseMinQuantity').value;
        } else if (type === 'retailPrice') {
            this.payload.retailPrice = this.groupForm.get('retailPrice').value;
        } else if (type === 'wholesalePrice') {
            this.payload.wholesalePrice = this.groupForm.get('wholesalePrice').value;
        } else if (type === 'minWholesaleSellQuantity') {
            this.payload.minWholesaleSellQuantity = this.groupForm.get('minWholesaleSellQuantity').value;
        }
    }
}
