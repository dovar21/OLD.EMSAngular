import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Item, SmppService } from '../smpp.service';
import { VALIDATION_ERRORS } from 'src/app/modules/common/lexicon/ru/validation-dictionary';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';
import { REGEXP } from 'src/app/app.config';

@Component({
    selector: 'smpp-config-form',
    templateUrl: './config-form.component.html'
})
export class SmppConfigFormComponent implements OnInit, OnDestroy {
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
    @Output() onProviderNameChange = new EventEmitter<string>();

    /**
     * An event that emits on create undo.
     */
    @Output() onUndoCreate = new EventEmitter<boolean>();

    constructor(private fb: FormBuilder, private service: SmppService, private snackbar: MatSnackBar) {
        this.form = this.fb.group({
            providerName: ['', Validators.required],
            hostName: ['', Validators.required],
            portNumber: [0, [Validators.required, Validators.pattern(REGEXP.DIGITS)]],
            userName: ['', Validators.required],
            password: ['', Validators.required],
            systemType: ['', Validators.required],
            sourceAddressTon: [0, [Validators.required, Validators.pattern(REGEXP.DIGITS)]],
            sourceAddressNpi: [0, [Validators.required, Validators.pattern(REGEXP.DIGITS)]],
            sourceAddressAutodetect: [true],
            destAddressTon: [0, [Validators.required, Validators.pattern(REGEXP.DIGITS)]],
            destAddressNpi: [0, [Validators.required, Validators.pattern(REGEXP.DIGITS)]],
            interfaceVersion: ['', Validators.required],
            deliveryUserAckRequest: ['', Validators.required],
            intermediateNotification: [true],
            dataEncoding: ['', Validators.required],
            validityPeriod: [0, [Validators.required, Validators.pattern(REGEXP.DIGITS)]],
            transceiverMode: [0, [Validators.required, Validators.pattern(REGEXP.DIGITS)]],
            receivePort: [0, [Validators.required, Validators.pattern(REGEXP.DIGITS)]],
            enquireLinkInterval: [0, [Validators.required, Validators.pattern(REGEXP.DIGITS)]],
            waitAckExpire: [0, [Validators.required, Validators.pattern(REGEXP.DIGITS)]],
            maxPendingSubmits: [0, [Validators.required, Validators.pattern(REGEXP.DIGITS)]],
            throughput: [0, [Validators.required, Validators.pattern(REGEXP.DIGITS)]],
            isDefault: [true],
            isActive: [true],
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
        console.log(this.form.value);

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
                            if (error.code === 1008) this.form.get('userName').setErrors({ duplicateUserName: true });
                        });
                    }
                },
                () => {
                    this.isRequesting = false;
                    this.form.enable();
                }
            );
    }

    ngOnDestroy() { }
}
