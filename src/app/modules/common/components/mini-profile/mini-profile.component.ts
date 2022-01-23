import { Component, Input } from '@angular/core';
import { User } from './mini-profile.service';

export interface MiniProfileConfig {
    // Component display size variation. Used for different CSS styling.
    small?: boolean;

    // Maximum width for name and position.
    maxWidth?: string;

    // Hide full name.
    hideFullName?: boolean;

    // Hide position.
    hidePosition?: boolean;
}

@Component({
    selector: 'mini-profile',
    templateUrl: './mini-profile.component.html',
    styleUrls: ['./mini-profile.component.sass']
})
export class MiniProfileComponent {
    /**
     * Data to be populated.
     */
    @Input() data: User;

    /**
     * Component display size variation. Used for different CSS styling.
     */
    @Input() small: boolean;

    /**
     * Maximum width for name and position.
     */
    @Input() maxWidth: string = '160px';

    /**
     * Config.
     */
    @Input() config: MiniProfileConfig = {
        small: false,
        maxWidth: '160px',
        hideFullName: false,
        hidePosition: false
    };
}
