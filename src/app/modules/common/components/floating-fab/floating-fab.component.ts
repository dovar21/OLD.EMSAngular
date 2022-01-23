import { Component, Input } from '@angular/core';

@Component({
    selector: 'floating-fab',
    templateUrl: './floating-fab.component.html',
    styleUrls: ['./floating-fab.component.sass']
})
export class FloatingFabComponent {
    /**
     * Link for Router navigation
     */
    @Input() link = './';

    /**
     * Button title
     */
    @Input() title = 'Добавить запись';

    /**
     * MatIcon name
     */
    @Input() icon = 'add';

    /**
     * Offset from window bottom.
     */
    @Input() bottom: string = '30px';

    /**
     * Material color theme.
     */
    @Input() color: string = 'primary';

    /**
     * Material tooltip position.
     */
    @Input() tooltipPosition: string = 'above';
}
