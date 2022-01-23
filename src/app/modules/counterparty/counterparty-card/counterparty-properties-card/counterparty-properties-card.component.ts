import { Component, Input, OnDestroy } from '@angular/core';
import { fade } from 'src/app/animations/all';
import { FormGroup } from '@angular/forms';
import { Counterparty, CounterpartyCreate } from '../../counterparty.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEDITOR_CONFIG } from '../../../../app.config';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';

@Component({
    selector: 'counterparty-properties-card',
    templateUrl: './counterparty-properties-card.component.html',
    styleUrls: ['./counterparty-properties-card.component.sass'],
    animations: [fade]
})
export class CounterpartyPropertiesCardComponent implements OnDestroy {
    // -------------------------------------------------------------------------
    // Inputs / Outputs
    // -------------------------------------------------------------------------

    /**
     * Counterparty which we look
     */
    @Input()
    counterparty: Counterparty;

    /**
     * Creation form.
     */
    @Input() groupForm: FormGroup;

    /**
     * Put payload by product ID
     */
    @Input() payload: CounterpartyCreate;

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Shown or hide editor mode
     */
    isEditMode: boolean = false;

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

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

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
        if (this.counterparty.description === this.groupForm.get('description').value) {
            this.isEditMode = false;
        } else {
            this.isEditMode = false;
            this.payload.description = this.groupForm.get('description').value;
            this.counterparty.description = this.groupForm.get('description').value;
        }
    }

    /**
     * Set CKEditor output to class field.
     */
    setBody({ editor }: ChangeEvent) {
        this.groupForm.get('description').setValue(editor.getData());
    }

    /**
     * MatAutocomplete select in object.
     * value number can only be when the type QuantityPerTare
     * @param type Product properties (DictionaryProductGroup|DictionaryCountry|DictionaryBrand|DictionaryUnit|DictionaryTare|QuantityPerTare)
     */
    productPropertiesSelect(type: 'legalName'|'itn'|'website') {
        switch (type) {
            case 'legalName':
                if (this.counterparty.legalName === this.groupForm.get('legalName').value) return;
                this.payload.legalName = this.groupForm.get('legalName').value;
                break;

            case 'itn':
                if (this.counterparty.itn === this.groupForm.get('itn').value) return;
                this.payload.itn = this.groupForm.get('itn').value;
                break;

            case 'website':
                if (this.counterparty.itn === this.groupForm.get('website').value) return;
                this.payload.website = this.groupForm.get('website').value;
        }
    }

    /**
     * Save quantityPerTare
     * @param valueType Counterparty properties (legalName|itn|website)
     */
    onBlurMethod(valueType: 'legalName'|'itn'|'website') {
        this.productPropertiesSelect(valueType);
    }
}
