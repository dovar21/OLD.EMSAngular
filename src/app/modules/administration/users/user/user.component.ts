import { Component, Input, OnInit, EventEmitter, Output, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { UserService, User } from './user.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/modules/authentication/auth.service';
import { fade } from 'src/app/animations/all';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.sass'],
    animations: [fade]
})
export class UserComponent implements OnInit, OnDestroy {
    /**
     * User ID.
     */
    @Input() id: string;

    /**
     * AdministrationEmployee ID.
     */
    @Input() employeeId: number;

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Determines whther user is locked or not.
     */
    isLocked: string;

    /**
     * User data.
     */
    user: User;

    /**
     * Event which fires when creating the user.
     */
    @Output() onAddEnd = new EventEmitter<boolean>();

    constructor(private service: UserService, private snackbar: MatSnackBar, private authService: AuthService) { }

    ngOnInit() {
        if (this.id) this.get();
    }

    /**
     * Create user based on administration-employee-view.
     */
    createUser() {
        this.isRequesting = true;

        this.service
            .createUser(this.employeeId)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.snackbar.open('Пользователь создан. Пароль выслан сотруднику на его номер телефона.');
                },
                (error: Response) => {
                    this.isRequesting = false;
                    this.onAddEnd.emit(false);
                },
                () => {
                    this.isRequesting = false;
                    this.onAddEnd.emit(true);
                }
            );
    }

    /**
     * Get user data
     */
    get() {
        this.service
            .getLockStatus(this.id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.user = { ...response.data, userId: this.id };
                this.isLocked = response.data.lockDate
            });
    }

    /**
     * Reset password.
     */
    resetPassword() {
        this.isRequesting = true;

        this.authService
            .resetPassword({ phoneNumber: this.user.phoneNumber })
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => this.snackbar.open('Новый пароль отправлен на номер ' + this.user.phoneNumber),
                (error: Response) => (this.isRequesting = false),
                () => (this.isRequesting = false)
            );
    }

    ngOnDestroy() { }
}
