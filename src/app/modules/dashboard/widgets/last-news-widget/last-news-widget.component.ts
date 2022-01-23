import { Component, OnInit, Input } from '@angular/core';
import { Item } from 'src/app/information/information.service';
import { PermissionsService } from 'src/app/modules/authentication/permissions.service';

@Component({
    selector: 'last-news-widget',
    templateUrl: './last-news-widget.component.html',
    styleUrls: ['./last-news-widget.component.sass']
})
export class LastNewsWidgetComponent implements OnInit {
    /**
     * Data to be populated.
     */
    @Input() data: Item[];

    /**
     * Granted permissions.
     */
    permissions: any;

    constructor(private permissionsService: PermissionsService) {}

    ngOnInit() {
        this.permissions = this.permissionsService.grantedPermissions;
    }
}
