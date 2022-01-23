import { Component, Input } from '@angular/core';
import { Message } from '../../mail.service';

@Component({
    selector: 'message-full-view',
    templateUrl: './full-view.component.html',
    styleUrls: ['./full-view.component.sass']
})
export class MessageFullViewComponent {
    /**
     * Message data to be populated.
     */
    @Input() message: Message;

    /**
     * Trigger print window.
     * @param event Event object.
     */
    print(event: Event) {
        event.preventDefault();
        window.print();
    }
}
