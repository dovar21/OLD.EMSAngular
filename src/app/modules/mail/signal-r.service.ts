import { Injectable, NgZone, OnDestroy } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
import { AuthService } from '../authentication/auth.service';
import { Message } from './mail.service';
import { PushNotificationsService } from 'ng-push';
import { Router } from '@angular/router';
import { playSound, componentDestroyed } from '../common/utils';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { takeUntil } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SignalRService implements OnDestroy {
    /**
     * Mail SignalR hub connection.
     */
    private hubConnection: signalR.HubConnection;

    /**
     * Unread messages count.
     */
    totalUnreadMessagesCount$ = new Subject<number>();

    /**
     * An observable of newly received message. Updated every time a message
     * comes from SignalR connection.
     *
     * You can subscribe to this observable anywhere and display incoming message.
     */
    newlyReceivedMessage$ = new Subject<Message>();

    /**
     * An observable of newly sent message. Updated every time a successful response
     * comes from SignalR connection after sending a message.
     *
     * You can subscribe to this observable anywhere and display sent message.
     */
    newlySentMessage$ = new Subject<Message>();

    /**
     * An observable of newly read message. Updated every time an unread message was
     * read.
     *
     * You can subscribe to this observable anywhere and update message read status.
     */
    newlyReadMessage$ = new Subject<Message>();

    constructor(
        private authService: AuthService,
        private notification: PushNotificationsService,
        private router: Router,
        private ngZone: NgZone,
        private snackbar: MatSnackBar
    ) {}

    /**
     * Start connection.
     */
    startConnection() {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(environment.API.SIGNALR + 'ListenMessages', {
                accessTokenFactory: () => this.authService.getToken()
            })
            .build();

        const connect = () => {
            if (this.authService.isSignedIn()) {
                this.hubConnection
                    .start()
                    .then(() => this.listen())
                    .catch(error => {
                        this.snackbar.open(
                            'Нестабильное соединение с Интернетом. Могут наблюдаться неполадки в доставке сообщений.'
                        );
                        setTimeout(connect, 15000);
                    });
            }
        };

        connect();
        this.hubConnection.onclose(connect);
    }

    /**
     * Listen to connection events.
     */
    private listen() {
        // New message received
        this.hubConnection.on('OnMessageReceived', (message: Message) => {
            this.showNotification(message);
            this.saveNewlyReceivedMessage(message);
        });

        // Unread messages count changed
        this.hubConnection.on('OnNotificationCountChange', (totalUnreadCount: number) => {
            this.saveUnreadMessagesCount(totalUnreadCount);
        });

        // Message successfully sent sent
        this.hubConnection.on('OnMessageSent', (message: Message) => {
            this.saveNewlySentMessage(message);
        });

        // Message was read
        this.hubConnection.on('OnMessageRead', (message: Message) => {
            console.log(message);
            this.saveReadMessage(message);
        });
    }

    /**
     * Save newly received message to an observable, which is accessable
     * anywhere else.
     * @param message Incoming message.
     */
    private saveNewlyReceivedMessage(message: Message) {
        this.newlyReceivedMessage$.next(message);
    }

    /**
     * Save newly sent message to an observable, which is accessable anywhere
     * else.
     * @param message Sent message.
     */
    private saveNewlySentMessage(message: Message) {
        this.newlySentMessage$.next(message);
    }

    /**
     * Show native WEB Notification API.
     * @param message Incoming message.
     */
    private showNotification(message: Message) {
        this.notification
            .create(message.title, {
                icon: message.user.photoPath,
                dir: 'auto'
            })
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                playSound();

                if (response.event.type === 'click') {
                    this.ngZone.run(() => {
                        this.router.navigate(['/messages'], { queryParams: { message: message.id } });
                    });
                    response.notification.close();
                }
            });
    }

    /**
     * Save total of unread messages count to be able to access it enywhere
     * else.
     * @param totalUnreadCount Total unread messages count.
     */
    private saveUnreadMessagesCount(totalUnreadCount: number) {
        this.totalUnreadMessagesCount$.next(totalUnreadCount);
    }

    /**
     * Save newly read message ID.
     * @param id Read message ID.
     */
    private saveReadMessage(message: Message) {
        this.newlyReadMessage$.next(message);
    }

    /**
     * Stop connection.
     */
    stopConnection() {
        this.hubConnection.stop();
    }

    ngOnDestroy() {}
}
