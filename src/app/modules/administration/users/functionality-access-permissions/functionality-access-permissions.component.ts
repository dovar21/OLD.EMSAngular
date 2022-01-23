import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FunctionalityAccessPermissionsService, PermissionGroup } from './functionality-access-permissions.service';
import { fade } from 'src/app/animations/all';
import { MatSnackBar } from '@angular/material';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';

@Component({
    selector: 'functionality-access-permissions',
    templateUrl: './functionality-access-permissions.component.html',
    styleUrls: ['./functionality-access-permissions.component.sass'],
    animations: [fade]
})
export class FunctionalityAccessPermissionsComponent implements OnInit, OnDestroy {
    /**
     * User ID.
     */
    @Input() id: number;

    /**
     * Determines whether the form should be disabled.
     */
    @Input() disabled: boolean;

    /**
     * Determines whether any fetch operation is in progress
     */
    isRequesting: boolean;

    /**
     * Initialize form.
     */
    form: FormGroup;

    /**
     * All permissions
     */
    permissions: PermissionGroup[];

    /**
     * Determines whether user screen is 991px or less
     */
    isSmallScreen: boolean = false;

    /**
     * A subscription containing Breakpoint Observer response.
     */
    subscription: Subscription;

    /**
     * Determines whether any fetch operation is in progress to emit the state up
     */
    @Output() isRequestingFunctionalityAccessPermissions = new EventEmitter<boolean>();

    constructor(
        private fb: FormBuilder,
        private service: FunctionalityAccessPermissionsService,
        private snackbar: MatSnackBar,
        private breakpointObserver: BreakpointObserver
    ) {
        this.form = this.fb.group({});
    }

    ngOnInit() {
        this.get();

        this.subscription = this.breakpointObserver
            .observe(['(max-width: 991px)'])
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe((state: BreakpointState) => {
                if (state.matches) this.isSmallScreen = true;
                else this.isSmallScreen = false;
            });
    }

    /**
     * Get all permissions.
     */
    private get() {
        this.isRequesting = true;
        setTimeout(() => this.isRequestingFunctionalityAccessPermissions.emit(true));

        this.service
            .get(this.id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    const formControlPermissions = {};

                    this.permissions = response.data;

                    response.data.forEach(permissionGroup =>
                        permissionGroup.roles.forEach(permission => {
                            formControlPermissions[permission.name] = [permission.selected];
                        })
                    );

                    this.form = this.fb.group(formControlPermissions);

                    if (this.disabled) setTimeout(() => this.form.disable(), 500);
                },
                (error: Response) => {
                    this.isRequesting = false;
                    setTimeout(() => this.isRequestingFunctionalityAccessPermissions.emit(false));
                },
                () => {
                    this.isRequesting = false;
                    setTimeout(() => this.isRequestingFunctionalityAccessPermissions.emit(false));
                }
            );
    }

    /**
     * Set user permissions
     */
    set() {
        const payload = this.constructPayload();

        this.isRequesting = true;

        this.service
            .set(payload)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.snackbar.open('Права пользователя сохранены.');
                },
                (error: Response) => (this.isRequesting = false),
                () => (this.isRequesting = false)
            );
    }

    /**
     * Construct request payload for setting user permissions
     */
    private constructPayload() {
        const payload = {
            userId: this.id.toString(),
            rolesName: []
        };

        Object.keys(this.form.controls).forEach(formControlName => {
            if (this.form.controls[formControlName].value === true) payload.rolesName.push(formControlName);
        });

        return payload;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
