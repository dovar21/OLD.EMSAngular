import { Component, OnInit, OnDestroy } from '@angular/core';
import { routerTransition } from './animations/router-transitions';
import { DateAdapter, MatSnackBar, MatDialog } from '@angular/material';
import { Router, NavigationEnd, ActivatedRoute, NavigationStart } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, takeUntil } from 'rxjs/operators';
import { PermissionsService } from './modules/authentication/permissions.service';
import { SignalRConnectionsService } from './modules/common/services/signal-r-connections.service';
import { AuthService } from './modules/authentication/auth.service';
import { componentDestroyed } from './modules/common/utils';

@Component({
    selector: 'app-root',
    animations: [routerTransition],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {
    /**
     * An array of granted permissions
     */
    grantedPermissionsObject: object;

    constructor(
        private dateAdapter: DateAdapter<any>,
        private permissionsService: PermissionsService,
        private router: Router,
        private titleService: Title,
        private snackbar: MatSnackBar,
        private signalRConnectionsService: SignalRConnectionsService,
        private authService: AuthService,
        private matDialog: MatDialog,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        // if (this.authService.isSignedIn()) this.signalRConnectionsService.start('onInit');

        // Set MatDatePicker locale
        this.dateAdapter.setLocale('ru');
        this.resetPermissionsObject();

        this.router.events
            .pipe(
                filter(event => event instanceof NavigationStart),
                map(() => this.router),
                takeUntil(componentDestroyed(this))
            )
            .subscribe(event => {
                this.snackbar.dismiss();
                this.matDialog.closeAll();

                //console.log(this.route.snapshot.data);
            });

        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => this.router),
                takeUntil(componentDestroyed(this))
            )
            .subscribe(event => {
                const title = this.constructTitle(this.router.routerState, this.router.routerState.root)
                    .reverse()
                    .join(' ‹ ');

                this.titleService.setTitle(title);
            });
    }

    /**
     * Construct document title based on route nesting.
     * @param state Current state snapshot.
     * @param parent Parent route.
     */
    private constructTitle(state, parent: ActivatedRoute) {
        const titlesArray = [];

        if (parent && parent.snapshot.data && parent.snapshot.data.title) titlesArray.push(parent.snapshot.data.title);
        if (state && parent) titlesArray.push(...this.constructTitle(state, state.firstChild(parent)));

        return titlesArray;
    }

    /**
     * Reset permission object
     */
    resetPermissionsObject() {
        this.grantedPermissionsObject = this.permissionsService.get();
    }

    /**
     * Access for reseting permissions objects
     */
    public get resetPermissions() {
        return this.resetPermissionsObject();
    }

    /**
     * Access granted permissions array from outside
     */
    public get grantedPermissions(): object {
        this.resetPermissionsObject();

        return this.grantedPermissionsObject;
    }

    /**
     * Get route state.
     * @param outlet Router outlet.
     */
    getState(outlet) {
        return outlet.activatedRouteData.state;
    }

    ngOnDestroy() {}
}
