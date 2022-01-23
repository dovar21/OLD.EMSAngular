import { Component, OnInit, Input, OnChanges, SimpleChange, OnDestroy } from '@angular/core';
import { MailService, Message, FetchCriterias } from '../mail.service';
import { fade } from 'src/app/animations/all';
import { ActivatedRoute } from '@angular/router';
import { SignalRService } from '../signal-r.service';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';

@Component({
    selector: 'messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.sass'],
    animations: [fade]
})
export class MessagesComponent implements OnInit, OnChanges, OnDestroy {
    /**
     * Type of the messages user is currently oberving (inbox || sent).
     */
    @Input() messagesType: string;

    /**
     * Filter criterias.
     */
    @Input() fetchCriterias: FetchCriterias;

    /**
     * Messages for preview.
     */
    messages: Message[] = [];

    /**
     * Current viewving message.
     */
    currentMessage: Message;

    /**
     * Current page number of messages preview list.
     */
    private currentPageNumber: number = 1;

    /**
     * Determind if all items were fetched.
     */
    private totalCountReached: boolean;

    /**
     * Determines whether filter returned no results.
     */
    noResults: boolean;

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    constructor(
        private service: MailService,
        private route: ActivatedRoute,
        private mailSignalRService: SignalRService
    ) {}

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        if (changes.fetchCriterias && changes.fetchCriterias.currentValue !== changes.fetchCriterias.previousValue)
            this.getMessages(1, changes.fetchCriterias.currentValue);
    }

    ngOnInit() {
        this.getMessages();
        this.openMessageFromQueryString();
        this.handleSignalR();
    }

    /**
     * Handles reactive actions on new message receiving.
     */
    private handleSignalR() {
        // Add newly received message to inbox messages list
        this.mailSignalRService.newlyReceivedMessage$
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe((message: Message) => {
                if (this.messagesType === 'inbox') this.messages.unshift(message);
            });

        // Add newly sent message to sent messages list
        this.mailSignalRService.newlySentMessage$
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe((message: Message) => {
                if (this.messagesType === 'sent') this.messages.unshift(message);
            });
    }

    /**
     * Get messages list for preview.
     */
    getMessages(pageNumber: number = 1, fetchCriterias?: FetchCriterias) {
        this.isRequesting = true;

        this.service
            .getMessages(this.messagesType, pageNumber, fetchCriterias)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    if (fetchCriterias) {
                        this.messages = response.data.items;

                        if (!response.data.items.length) this.noResults = true;
                        else this.noResults = false;
                    } else this.messages = [...this.messages, ...response.data.items];

                    this.currentPageNumber = response.data.page;

                    this.messages.length >= response.data.totalCount
                        ? (this.totalCountReached = true)
                        : (this.totalCountReached = false);
                },
                error => (this.isRequesting = false),
                () => (this.isRequesting = false)
            );
    }

    /**
     * Fetch next batch on scroll.
     */
    infiniteScroll() {
        if (!this.totalCountReached) this.getMessages(this.currentPageNumber + 1);
    }

    /**
     * Filter messages by title or author name.
     * @param query Message title or author name.
     */
    filterByTitle(event: any) {
        const query = event.target.value;
        const excludedKeys = [16, 17, 18, 20, 91, 93, 220];
        const isMinLengthAcceptable = query.length >= 3;

        if ((isMinLengthAcceptable && !excludedKeys.includes(event.keyCode)) || query.length === 0) {
            setTimeout(() => {
                this.getMessages(1, { title: query });
            }, 1000);
        }
    }

    /**
     * Open choosen message by ID.
     * @param id Message ID.
     */
    openMessage(id: number) {
        this.service
            .getMessage(id, this.messagesType)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.currentMessage = response.data;

                // if (this.messagesType === 'inbox') {
                //     this.messages.forEach(message => {
                //         if (message.id === response.data.id) message.readDate = moment().toString();
                //     });
                // }
            });
    }

    /**
     * Open message full view if URL contains it's id as query param.
     */
    private openMessageFromQueryString() {
        this.route.queryParamMap.pipe(takeUntil(componentDestroyed(this))).subscribe(param => {
            const messageId = +param.get('message');
            if (messageId) this.openMessage(messageId);
        });
    }

    ngOnDestroy() {}
}
