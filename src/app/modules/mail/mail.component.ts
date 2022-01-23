import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CreateComponent } from './send/send.component';
import { FetchCriterias } from './mail.service';
import { PerfectScrollbarConfig } from 'ngx-perfect-scrollbar';

interface NavigationLink {
    title: string;
    path: string;
    icon: string;
}

@Component({
    selector: 'mail',
    templateUrl: './mail.component.html',
    styleUrls: ['./mail.component.sass']
})
export class MailComponent implements OnInit {
    /**
     * Page title.
     */
    title = this.route.snapshot.data['title'];

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Navigation links.
     */
    navigationLinks: NavigationLink[];

    /**
     * Type of the messages user is currently oberving (inbox || sent).
     */
    messagesType: string;

    /**
     * Filter criterias.
     */
    fetchCriterias: FetchCriterias;

    /**
     * Ngx-perfect-scrollbar config object.
     */
    perfectScrollbarConfig: PerfectScrollbarConfig = {
        suppressScrollY: true,
        assign: () => {}
    };

    constructor(private route: ActivatedRoute, private dialog: MatDialog) {}

    ngOnInit() {
        this.messagesType = this.route.snapshot.data.messagesType;

        this.navigationLinks = [
            { title: 'Входящие', path: 'inbox', icon: 'archive' },
            { title: 'Отправленные', path: 'sent', icon: 'send' }
        ];
    }

    /**
     * Open send message dialog.
     */
    openCreateDialog() {
        this.dialog.open(CreateComponent, { maxWidth: '600px', width: '600px' });
    }
}
