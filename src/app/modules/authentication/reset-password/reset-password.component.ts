import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../auth.service';
import { AuthComponent } from '../auth.component';
import { VALIDATION_ERRORS } from 'src/app/modules/common/lexicon/ru/validation-dictionary';
import { componentDestroyed } from 'src/app/modules/common/utils';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.sass']
})
export class ResetPasswordComponent implements OnDestroy {
    /**
     * Register form and it's controls.
     */
    form = new FormGroup({
        phoneNumber: new FormControl('', [
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(9),
            Validators.pattern('^[0-9]*$')
        ])
    });

    /**
     * An object with all validation erros.
     */
    validationErrors = VALIDATION_ERRORS;

    /**
     * Event that fires when 'Отмена' button clicked.
     */
    @Output() onResetPassLinkClick = new EventEmitter<boolean>();

    constructor(private snackbar: MatSnackBar, public authService: AuthService, public authComponent: AuthComponent) {}

    /**
     * Reset password.
     */
    resetPassword() {
        // Don't submit if form has errors
        if (this.form.invalid) return false;

        this.authComponent.switchFormState(this.form, 'disable');

        this.authService
            .resetPassword(this.form.value)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.snackbar.open('Новый пароль отправлен на номер ' + this.form.get('phoneNumber').value);

                    setTimeout(() => this.undo(), 5000);
                },
                (error: any) => {
                    this.authComponent.switchFormState(this.form, 'enable');

                    if (error.status === 400) {
                        error.error.errors.forEach(error => {
                            if (error.code === 1007) this.form.get('phoneNumber').setErrors({ userNotFound: true });
                        });
                    }
                },
                () => this.authComponent.switchFormState(this.form, 'enable')
            );
    }

    /**
     * Determines whether the user clicked "Отмена".
     * And emits custom event up to AuthComponent.
     */
    undo() {
        this.onResetPassLinkClick.emit(false);
    }

    ngOnDestroy() {}
}
