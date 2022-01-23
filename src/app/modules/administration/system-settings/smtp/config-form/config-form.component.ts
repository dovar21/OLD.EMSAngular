import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SmtpService, Item } from '../smtp.service';
import { MatSnackBar } from '@angular/material';
import { VALIDATION_ERRORS } from 'src/app/modules/common/lexicon/ru/validation-dictionary';
import { REGEXP } from 'src/app/app.config';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';

@Component({
    selector: 'smtp-config-form',
    templateUrl: './config-form.component.html'
})
export class ConfigFormComponent implements OnInit, OnDestroy {
    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Determines whether current config set as default.
     */
    @Input() isDefault: boolean;

    /**
     * Data to be populated.
     */
    @Input() data: Item;

    /**
     * Initialize form.
     */
    form: FormGroup;

    /**
     * Form values for request
     */
    payload: Item;

    /**
     * An object with all validation erros.
     */
    validationErrors = VALIDATION_ERRORS;

    /**
     * An event which emits on config save.
     */
    @Output() onSubmit: EventEmitter<Item> = new EventEmitter<Item>();

    /**
     * Newly created config name.
     */
    @Output() onMailServerNameChange = new EventEmitter<string>();

    /**
     * An event that emits on create undo.
     */
    @Output() onUndoCreate = new EventEmitter<boolean>();

    /**
     * An event that emits item ID on it's deletion.
     */
    @Output() onDelete = new EventEmitter<string>();

    constructor(private fb: FormBuilder, private service: SmtpService, private snackbar: MatSnackBar) {
        this.form = this.fb.group({
            mailServerName: ['', Validators.required],
            mailServer: ['', Validators.required],
            mailPort: [465, [Validators.required, Validators.pattern(REGEXP.DIGITS)]],
            SSL: [true],
            sender: ['', Validators.required],
            password: ['', Validators.required],
            senderName: ['', Validators.required],
            isDefault: [false],
            isActive: [true]
        });
    }

    ngOnInit() {
        this.form.patchValue(this.data);
    }

    /**
     * Set isActive control to false if isDefault is set to false.
     * @param state isDefault control state.
     */
    bindDefaultToActive(state: boolean) {
        if (state === true) this.form.get('isActive').setValue(state);
    }

    /**
     * Set isDefault control to false if isActive is set to false.
     * @param state isActive control state.
     */
    bindActiveToDefault(state: boolean) {
        if (state === false) this.form.get('isDefault').setValue(state);
    }

    submit() {
        if (this.form.invalid) {
            this.snackbar.open('В форме содержатся ошибки.');

            return false;
        }

        const payload = this.form.value;

        let action = 'Create';

        if (this.data.id) {
            action = 'Edit';
            payload.id = this.data.id;
        }

        this.isRequesting = true;
        this.form.disable();

        this.service
            .submit(action, payload)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.data = response.data;
                    this.form.patchValue(this.data);

                    this.snackbar.open(action === 'Create' ? 'Конфигурация сохранена.' : 'Конфигурация изменена.');
                    this.onSubmit.emit(response.data);
                },
                error => {
                    this.isRequesting = false;
                    this.form.enable();

                    if (error.status === 400) {
                        error.error.errors.forEach(error => {
                            if (error.code === 1006) this.form.get('sender').setErrors({ duplicateSender: true });
                        });
                    }
                },
                () => {
                    this.isRequesting = false;
                    this.form.enable();
                }
            );
    }

    /**
     * Delete config.
     */
    delete() {
        this.isRequesting = true;
        this.service
            .delete(this.data.id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.snackbar.open('Конфигурация удалена.');
                    this.onDelete.emit(this.data.id.toString());
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

    ngOnDestroy() {}
}
