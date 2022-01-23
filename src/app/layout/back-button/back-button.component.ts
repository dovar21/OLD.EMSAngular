import { Component, OnInit, OnDestroy } from '@angular/core';
import { fade } from 'src/app/animations/all';
import { Location } from '@angular/common';
import { filter, pairwise, takeUntil } from 'rxjs/operators';
import { Router, RoutesRecognized, NavigationEnd } from '@angular/router';
import { componentDestroyed } from 'src/app/modules/common/utils';

@Component({
    selector: 'back-button',
    templateUrl: './back-button.component.html',
    styleUrls: ['./back-button.component.sass'],
    animations: [fade]
})
export class BackButtonComponent implements OnInit, OnDestroy {
    /**
     * Last history entry title.
     */
    prevPageTitle: string = 'Назад';

    /**
     * Determines whether the button is visible.
     */
    isVisible: boolean;

    constructor(public location: Location, private router: Router) {}

    ngOnInit() {
        this.router.events
            .pipe(
                filter((event: any) => event instanceof NavigationEnd),
                takeUntil(componentDestroyed(this))
            )
            .subscribe(event => (this.isVisible = true));
    }

    ngOnDestroy() {}
}
