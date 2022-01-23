import { Injectable } from '@angular/core';
import { SignalRService } from 'src/app/modules/mail/signal-r.service';
import { PushNotificationsService } from 'ng-push';
import { AuthService } from 'src/app/modules/authentication/auth.service';

@Injectable({
    providedIn: 'root'
})
export class SignalRConnectionsService {
    constructor(
        private mailSignalRService: SignalRService,
        private notifications: PushNotificationsService,
        private authService: AuthService
    ) {}

    /**
     * Start connections depending on passed event.
     * @param event Event, that determines, which connections should be
     * started.
     */
    start(event: string) {
        switch (event) {
            // On app init.
            case 'onInit':
                this.startMailSignalRConnection();
                break;

            // On sign in.
            case 'onSignIn':
                this.startMailSignalRConnection();
                break;
        }
    }

    /**
     * Start connections depending on passed event.
     * @param event Event, that determines, which connections should be
     * stopped.
     */
    stop(event: string) {
        switch (event) {
            // On sign-out.
            case 'onSignOut':
                this.mailSignalRService.stopConnection();
                break;
        }
    }

    /**
     * Start system mail SignalR connection.
     */
    private startMailSignalRConnection() {
        if (this.authService.isSignedIn()) {
            this.mailSignalRService.startConnection();
            if (this.notifications.isSupported()) this.notifications.requestPermission();
        }
    }
}
