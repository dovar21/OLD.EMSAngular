import { Component, Input } from '@angular/core';

@Component({
    selector: 'alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['./alert.component.sass']
})
export class AlertComponent {
    /**
     * Message body
     */
    @Input() message: string;

    /**
     * Alert type (success || info || danger)
     */
    @Input() type: string;
}
