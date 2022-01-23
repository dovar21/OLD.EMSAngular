import { trigger, animate, style, group, query, transition } from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
    transition('* <=> *', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' }), {
            optional: true
        }),
        group([
            query(
                ':enter',
                [
                    style({ transform: 'scale(1.2)', opacity: 0 }),
                    animate('0.2s ease-in-out', style({ transform: 'scale(1)', opacity: 1 }))
                ],
                { optional: true }
            ),
            query(
                ':leave',
                [
                    style({ transform: 'scale(1)', opacity: 1 }),
                    animate('0.2s ease-in-out', style({ transform: 'scale(1.2)', opacity: 0 }))
                ],
                { optional: true }
            )
        ])
    ])
]);
