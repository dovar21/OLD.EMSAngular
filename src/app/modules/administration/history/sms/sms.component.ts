import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fade } from 'src/app/animations/all';

@Component({
    selector: 'app-sms',
    templateUrl: './sms.component.html',
    styleUrls: ['./sms.component.sass'],
    animations: [fade]
})
export class SmsComponent implements OnInit {
    /**
     * Page title.
     */
    title = this.route.snapshot.data['title'];

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {}
}
