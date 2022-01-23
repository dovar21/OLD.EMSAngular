import { Component, Input } from '@angular/core';
import { Product } from '../product.service';

@Component({
    selector: 'product-preview-card',
    templateUrl: './product-preview-card.component.html',
    styleUrls: ['./product-preview-card.component.sass']
})
export class ProductPreviewCardComponent {
    /**
     * Data to be displayed.
     */
    @Input() data: Product;
}
