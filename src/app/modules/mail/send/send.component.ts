import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutocompleteUser, MailService } from '../mail.service';
import { Observable, Subscription } from 'rxjs';
import { startWith, map, filter, takeUntil } from 'rxjs/operators';
import { CKEDITOR_CONFIG } from 'src/app/app.config';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { NavigationEnd, Router, NavigationStart } from '@angular/router';
import { componentDestroyed } from 'src/app/modules/common/utils';

@Component({
    selector: 'create-message',
    templateUrl: './send.component.html'
})
export class CreateComponent implements OnInit, OnDestroy {
    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Dialog title.
     */
    title: string;

    /**
     * Creation form.
     */
    form: FormGroup;

    /**
     *  List of users.
     */
    private users: AutocompleteUser[];

    /**
     * List of mathced users when typing into autocomplete field.
     */
    filteredUsers: Observable<AutocompleteUser[]>;

    /**
     * CKEditor
     */
    Editor = ClassicEditor;

    /**
     * CKEditor config
     */
    editorConfig = {
        ...CKEDITOR_CONFIG,
        toolbar: {
            items: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
        }
        //placeholder: 'Текст сообщения'
    };

    /**
     * A subscription which validates user on autocomplete value change.
     */
    receiverAutocompleteSubscription: Subscription;

    /**
     * A subscription observing router events.
     */
    routerEventsSubscription: Subscription;

    constructor(
        public dialogRef: MatDialogRef<CreateComponent>,
        private snackbar: MatSnackBar,
        private fb: FormBuilder,
        private service: MailService,
        private router: Router
    ) {
        this.form = this.fb.group({
            title: ['', Validators.required],
            body: ['', Validators.required],
            receiverUserId: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.getUsers();

        this.receiverAutocompleteSubscription = this.form
            .get('receiverUserId')
            .valueChanges.pipe(takeUntil(componentDestroyed(this)))
            .subscribe(user => {
                this.validateReceiver(user);
            });

        this.closeDialogOnRouteChange();
    }

    /**
     * Close currently open MatDialog on route change.
     *
     * Dialogs aren't closing when refreshing token fails
     * thus user forcefully navigated to /auth.
     */
    private closeDialogOnRouteChange() {
        this.routerEventsSubscription = this.router.events
            .pipe(
                filter(event => event instanceof NavigationStart),
                map(() => this.router)
            )
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(event => this.dialogRef.close());
    }

    /**
     * Get users for compose autocomplete.
     */
    private getUsers() {
        this.isRequesting = true;
        this.form.disable();

        this.service
            .getUsers()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.users = response.data;

                    this.filteredUsers = this.form.get('receiverUserId').valueChanges.pipe(
                        startWith(''),
                        map(value => (typeof value === 'string' ? value : value.name)),
                        map(name => (name ? this.filterAutocomplete(name) : this.users.slice()))
                    );
                },
                error => {
                    this.isRequesting = false;
                    this.form.enable();
                },
                () => {
                    this.isRequesting = false;
                    this.form.enable();
                }
            );
    }

    /**
     * MatAutocomplete display format.
     * @param user
     */
    autocompleteDisplayFn(user?: AutocompleteUser): string {
        return user.name;
    }

    /**
     * Check if typed value exists in provided users array.
     * Find corresponding item an the array and assign it to
     * form control if item exist, throw an error if otherwise.
     */
    private validateReceiver(enteredUser: any) {
        if (!enteredUser.name) {
            const matchedUser = this.users.filter(user => user.name === enteredUser)[0];
            const receiverUserIdFromControl = this.form.get('receiverUserId');

            if (matchedUser) receiverUserIdFromControl.setValue(matchedUser);
            else receiverUserIdFromControl.setErrors({ notFound: true });
        }
    }

    /**
     * Filter users when typing into autocomplete field.
     * @param name User name.
     */
    private filterAutocomplete(name: string): AutocompleteUser[] {
        const filterValue = name.toLowerCase();

        return this.users.filter(user => user.name.toLowerCase().includes(filterValue));
    }

    /**
     * Set CKEditor output to class field.
     */
    setBody({ editor }: ChangeEvent) {
        this.form.get('body').setValue(editor.getData());
    }

    /**
     * Submit composed message.
     */
    submit() {
        if (this.form.invalid) {
            this.snackbar.open('В форме содержатся ошибки.');

            return false;
        }

        const payload = {
            ...this.form.value,
            receiverUserId: this.form.get('receiverUserId').value.id
        };

        this.isRequesting = true;
        this.form.disable();

        this.service
            .sendMessage(payload)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.snackbar.open('Сообщение отправлено.');
                    this.dialogRef.close(response.data);
                },
                error => {
                    this.isRequesting = false;
                    this.form.enable();
                },
                () => {
                    this.isRequesting = false;
                    this.form.enable();
                }
            );
    }

    ngOnDestroy() {
        this.receiverAutocompleteSubscription.unsubscribe();
        this.routerEventsSubscription.unsubscribe();
    }
}
