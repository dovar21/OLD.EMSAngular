import { Component, OnInit } from '@angular/core';
import User, { MiniProfileService } from './mini-profile.service';

@Component({
    selector: 'header-mini-profile',
    templateUrl: './mini-profile.component.html',
    styleUrls: ['./mini-profile.component.sass']
})
export class MiniProfileComponent implements OnInit {
    user: User;

    constructor(private service: MiniProfileService) {}

    ngOnInit() {
        this.user = this.service.getUser();
    }
}
