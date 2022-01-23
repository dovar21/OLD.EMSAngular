import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { Message } from '../../mail.service';
import { fade } from 'src/app/animations/all';
import { MiniProfileConfig } from 'src/app/modules/common/components/mini-profile/mini-profile.component';
import { SignalRService } from '../../signal-r.service';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';

@Component({
    selector: 'message-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.sass'],
    animations: [fade]
})
export class MessagePreviewCardComponent implements OnChanges, OnInit, OnDestroy {
    /**
     * Message to populate.
     */
    @Input() message: Message;

    /**
     * Type of the messages user is currently oberving (inbox || sent).
     */
    @Input() messageType: string;

    /**
     * Currently opened message ID.
     */
    @Input() openedMessageID: string;

    /**
     * Description text label for read status tooltip.
     */
    readStatus: string;

    /**
     * An event which fires when a message is clicked.
     */
    @Output() openMessage: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Determines if current message is active.
     */
    isActive: boolean = false;

    /**
     * Mini profile config object.
     */
    miniProfileConfig: MiniProfileConfig = {
        maxWidth: '110px',
        hideFullName: true,
        hidePosition: true
    };

    constructor(private mailSignalRService: SignalRService) {}

    ngOnInit(): void {
        this.readStatus = this.message.readDate
            ? `Сообщение прочитано ${this.message.readDate}`
            : 'Сообщение не прочитано';

        this.updateReadStatus();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.openedMessageID && changes.openedMessageID.currentValue === this.message.id) this.isActive = true;
        else this.isActive = false;
    }

    /**
     * Update read status.
     */
    updateReadStatus() {
        this.mailSignalRService.newlyReadMessage$.pipe(takeUntil(componentDestroyed(this))).subscribe(message => {
            if (message.id === this.message.id) this.message.readDate = message.readDate;
        });
    }

    ngOnDestroy() {}
}
