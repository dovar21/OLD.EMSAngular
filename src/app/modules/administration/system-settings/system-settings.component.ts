import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { fade } from 'src/app/animations/all';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';

@Component({
    selector: 'system-settings',
    templateUrl: './system-settings.component.html',
    styleUrls: ['./system-settings.component.sass'],
    animations: [fade]
})
export class SystemSettingsComponent implements OnInit, OnDestroy {
    /**
     * Page title.
     */
    title = this.route.snapshot.data['title'];

    /**
     * Determines whether user screen is 991px or less
     */
    isSmallScreen: boolean = false;

    /**
     * A subscription containing Breakpoint Observer response.
     */
    subscription: Subscription;

    constructor(private route: ActivatedRoute, private breakpointObserver: BreakpointObserver) {}

    ngOnInit() {
        this.subscription = this.breakpointObserver
            .observe(['(max-width: 991px)'])
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe((state: BreakpointState) => {
                if (state.matches) this.isSmallScreen = true;
                else this.isSmallScreen = false;
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
