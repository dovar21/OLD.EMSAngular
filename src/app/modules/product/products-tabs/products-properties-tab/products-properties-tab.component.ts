import {Component, Input} from '@angular/core';
import {fade} from 'src/app/animations/all';
import { Product, ProductCreate } from '../../product.service';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'products-properties-tab',
    templateUrl: './products-properties-tab.component.html',
    styleUrls: ['./products-properties-tab.component.sass'],
    animations: [fade]
})
export class ProductsPropertiesTabComponent {

    /**
     * Product to be populated.
     */
    @Input() product: Product;

    /**
     * FormGroup for payload.
     */
    @Input() groupForm: FormGroup;

    /**
     * FormGroup for payload.
     */
    @Input() payload: ProductCreate;

}
