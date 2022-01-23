import { trigger, transition, style, animate, state } from '@angular/animations';

/**
 * Fade in/out.
 */
export const fade = trigger('fade', [
    transition(':enter', [style({ opacity: 0 }), animate('200ms', style({ opacity: 1 }))]),
    transition(':leave', [style({ opacity: 1 }), animate('200ms', style({ opacity: 0 }))])
]);

/**
 * Expandable table rows.
 */
export const detailExpand = trigger('detailExpand', [
    state('collapsed', style({ height: '0px', minHeight: '0' })),
    state('expanded', style({ height: '*' })),
    transition('expanded <=> collapsed', animate('300ms cubic-bezier(0.86, 0, 0.07, 1)'))
]);
