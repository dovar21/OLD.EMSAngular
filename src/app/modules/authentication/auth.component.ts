import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.sass']
})
export class AuthComponent implements OnInit {
    /**
     * Card title
     */
    cardTitle: string;

    /**
     * Determines whether user forgot the password
     */
    forgotPassword = false;

    /**
     * Determines whether any fetch operation is in progress
     */
    isRequesting = false;

    constructor(public authService: AuthService, private router: Router) {}

    ngOnInit() {
        if (this.authService.getToken()) this.router.navigate(['/']);
    }

    /**
     * Set determination field value (declared above)
     * @param $event boolean
     */
    setForgotPasswordState($event: boolean) {
        this.forgotPassword = $event;

        // Change form title
        $event ? this.setCardTitle('Сброс пароля') : this.setCardTitle();
    }

    /**
     * Set card title
     * @param title Title
     */
    setCardTitle(title?: string) {
        if (!title) this.cardTitle = 'Вход в систему';
        else this.cardTitle = title;
    }

    /**
     * Disables / enables passed form and loading spinner
     * @param form Reactive form object
     * @param state Strign: disable || enable
     */
    switchFormState(form, state: string) {
        switch (state) {
            case 'disable':
                form.disable();
                this.isRequesting = true;
                break;
            case 'enable':
                form.enable();
                this.isRequesting = false;
                break;
        }
    }
}
