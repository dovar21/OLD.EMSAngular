import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { fade } from 'src/app/animations/all';
import { Product, ProductCreate } from '../../product.service';
import { FormGroup } from '@angular/forms';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { CKEDITOR_CONFIG } from '../../../../app.config';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
    selector: 'product-description-card',
    templateUrl: './product-description-card.component.html',
    styleUrls: ['./product-description-card.component.sass'],
    animations: [fade]
})
export class ProductDescriptionCardComponent implements OnInit, OnDestroy {
    // -------------------------------------------------------------------------
    // Inputs / Outputs
    // -------------------------------------------------------------------------

    /**
     * Product to be populated.
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
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * CKEditor
     */
    Editor = ClassicEditor;

    /**
     * CKEditor config
     */
    editorConfig = {
        ...CKEDITOR_CONFIG,
        toolbar: {
            items: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
        }
    };

    /**
     * Shown or hide editor mode
     */
    isEditMode: boolean = false;

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.groupForm.patchValue(this.product);
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Set CKEditor output to class field.
     */
    setBody({ editor }: ChangeEvent) {
        this.groupForm.get('description').setValue(editor.getData());
    }

    /**
     * Focus on the editor and show it description edit
     */
    focusIn() {
        this.isEditMode = true;
    }

    /**
     * Remove focus from editor and save product description
     */
    focusOut() {
        this.payload.description = this.groupForm.get('description').value;
        this.product.description = this.groupForm.get('description').value;
        this.isEditMode = false;
    }
}
