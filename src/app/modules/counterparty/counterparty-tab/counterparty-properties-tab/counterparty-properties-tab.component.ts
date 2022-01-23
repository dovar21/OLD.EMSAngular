import {Component, Input} from '@angular/core';
import {fade} from 'src/app/animations/all';
import { Counterparty, CounterpartyCreate } from '../../counterparty.service';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'counterparty-properties-tab',
    templateUrl: './counterparty-properties-tab.component.html',
    styleUrls: ['./counterparty-properties-tab.component.sass'],
    animations: [fade]
})
export class CounterpartyPropertiesTabComponent {

    /**
     * Counterparty to be populated.
     */
    @Input()
    counterparty: Counterparty;

    /**
     * FormGroup for payload.
     */
    @Input() groupForm: FormGroup;

    /**
     * FormGroup for payload.
     */
    @Input() payload: CounterpartyCreate;

}
