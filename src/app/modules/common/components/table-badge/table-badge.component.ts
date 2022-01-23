import { Component, Input } from '@angular/core';

@Component({
    selector: 'table-badge',
    templateUrl: './table-badge.component.html',
    styleUrls: ['./table-badge.component.sass']
})
export class TableBadgeComponent {
    /**
     * True || False
     */
    @Input() state: boolean;

    /**
     * Value to be displayed
     */
    @Input() value: string;
}
