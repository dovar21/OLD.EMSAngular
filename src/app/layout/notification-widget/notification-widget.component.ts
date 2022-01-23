import { Component, OnInit, OnDestroy } from '@angular/core';
import { SignalRService } from 'src/app/modules/mail/signal-r.service';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';

@Component({
    selector: 'notification-widget',
    templateUrl: './notification-widget.component.html',
    styleUrls: ['./notification-widget.component.sass']
})
export class NotificationWidgetComponent implements OnInit, OnDestroy {
    /**
     * Unread messages count.
     */
    notificationCount: number;

    /**
     * Determines if widget should pulse.
     */
    pulse: boolean;

    constructor(private messagesSignalRService: SignalRService) {}

    ngOnInit() {
        this.updateNotificationCount();
    }

    /**
     * Update total unread messages count.
     */
    private updateNotificationCount() {
        this.messagesSignalRService.totalUnreadMessagesCount$
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe((value: number) => {
                if (this.notificationCount < value) this.pulse = true;
                this.notificationCount = value;
            });
    }

    ngOnDestroy() {}
}
