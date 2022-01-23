import { Component, Input, Output, EventEmitter } from '@angular/core';
import { fade } from 'src/app/animations/all';
import { Item } from '../information.service';
import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'article-card',
    templateUrl: './article-card.component.html',
    styleUrls: ['./article-card.component.sass'],
    animations: [fade]
})
export class ArticleCardComponent {
    /**
     * Data to be populated.
     */
    @Input() data: Item;

    /**
     * Determines if the card is used for displaying full
     * item info on the separate route.
     */
    @Input() isFullView: boolean;

    /**
     * Controller name (see API) where the card is being used.
     */
    @Input() controllerName: string;

    /**
     * An event that fires when create/update dialog opens.
     */
    @Output() onCreateUpdateDialogOpen: EventEmitter<number> = new EventEmitter<number>();

    /**
     * Granted permissions.
     */
    permissions = this.app.grantedPermissions;

    constructor(private app: AppComponent) {}

    /**
     * Emit an event to call create/update MatDialog.
     */
    openCreateUpdateDialog() {
        this.onCreateUpdateDialogOpen.emit(this.data.id);
    }
}
