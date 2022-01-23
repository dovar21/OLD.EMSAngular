import { AuthComponent } from "../auth.component";
import { AuthService } from "../auth.service";
import {
    Component,
    EventEmitter,
    Output,
    OnInit,
    OnDestroy
} from "@angular/core";
import {
    FormGroup,
    FormControl,
    Validators,
    FormBuilder
} from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { AppComponent } from "src/app/app.component";
import { VALIDATION_ERRORS } from "src/app/modules/common/lexicon/ru/validation-dictionary";
import { SignalRConnectionsService } from "src/app/modules/common/services/signal-r-connections.service";
import { takeUntil } from "rxjs/operators";
import { componentDestroyed } from "src/app/modules/common/utils";

@Component({
    selector: "sign-in",
    templateUrl: "./sign-in.component.html",
    styleUrls: ["./sign-in.component.sass"]
})
export class SignInComponent implements OnInit, OnDestroy {
    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Sign-in form.
     */
    form: FormGroup;

    /**
     * Event that fires when 'Забыл пароль' link clicked.
     */
    @Output() onResetPassLinkClick = new EventEmitter<boolean>();

    constructor(
        private snackbar: MatSnackBar,
        public authService: AuthService,
        public authComponent: AuthComponent,
        private router: Router,
        private route: ActivatedRoute,
        private app: AppComponent,
        private signalRConnectionsService: SignalRConnectionsService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            phoneNumber: [
                "",
                [
                    Validators.required,
                    Validators.minLength(9),
                    Validators.maxLength(9),
                    Validators.pattern("^[0-9]*$")
                ]
            ],
            password: ["", [Validators.required]],
            rememberMe: [false]
        });
    }

    ngOnInit() {
        this.isRequesting = this.authComponent.isRequesting;
    }

    /**
     * Do the sign in process.
     */
    signIn() {
        // Don't submit if form has errors
        if (this.form.invalid) return false;

        this.authComponent.switchFormState(this.form, "disable");

        this.authService
            .signIn(this.form.value)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    // Reset user permissions object
                    this.app.resetPermissions;

                    // this.signalRConnectionsService.start('onSignIn');

                    const returnUrl = this.route.snapshot.queryParamMap.get(
                        "returnUrl"
                    );
                    this.router.navigate([returnUrl || "/"]);
                },
                (error: any) => {
                    this.authComponent.switchFormState(this.form, "enable");

                    if (error.status === 400) {
                        error.error.errors.forEach(error => {
                            this.snackbar.open(VALIDATION_ERRORS[error.code]);
                        });
                    }
                },
                () => this.authComponent.switchFormState(this.form, "enable")
            );
    }

    /**
     * Determines whether the user clicked "Забыл пароль".
     * And emits custom event up to AuthComponent.
     */
    resetPassword() {
        this.onResetPassLinkClick.emit(true);
    }

    ngOnDestroy() {}
}
