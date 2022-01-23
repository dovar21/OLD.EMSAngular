import { Component, Input } from '@angular/core';
import { Counterparty } from '../counterparty.service';

@Component({
    selector: 'counterparty-preview-card',
    templateUrl: './counterparty-preview-card.component.html',
    styleUrls: ['./counterparty-preview-card.component.sass']
})
export class CounterpartyPreviewCardComponent {
    /**
     * Data to be displayed.
     */
    @Input() data: Counterparty;
}
