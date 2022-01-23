import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LockService, LockReason, UserLockStatus } from './lock.service';
import { MatSnackBar } from '@angular/material';
import { fade } from '../../../animations/all';
import { UserService } from '../users/user/user.service';
import { DashboardLayoutComponent } from 'src/app/layout/dashboard-layout/dashboard-layout.component';
import { Observable } from 'rxjs';
import BaseResponseInterface from 'src/app/modules/common/interfaces/base-response.interface';
import { componentDestroyed } from 'src/app/modules/common/utils';
import { takeUntil } from 'rxjs/operators';
import { VALIDATION_ERRORS } from 'src/app/modules/common/lexicon/ru/validation-dictionary';
import { AdministrationEmployeeService, AdministrationEmployeeEssentialData } from '../administration-employee/administration-employee.service';

interface EmployeePlusUser extends AdministrationEmployeeEssentialData, UserLockStatus { }

@Component({
    selector: 'lock-form',
    templateUrl: './lock-form.component.html',
    styleUrls: ['./lock-form.component.sass'],
    animations: [fade]
})
export class LockFormComponent implements OnInit, OnDestroy {
    /**
     * Type of the entity to do job on (administration-employee-view || user).
     */
    @Input() entityType: string;

    /**
     * Entity full info.
     */
    @Input() entity: EmployeePlusUser;

    /**
     * Form layout
     */
    @Input() horisontal: boolean;

    /**
     * Access dashboard layout props and methods
     */
    dashboardLayout = DashboardLayoutComponent;

    /**
     * Determines whether any fetch operation is in progress
     */
    isRequesting: boolean;

    /**
     * List of lock reasons for selectbox
     */
    lockReasons: LockReason[];

    /**
     * Determmines whether entity is locked
     */
    entityLockStatus: {
        isLocked: string;
        lockReasonName: string;
        lockDate: string;
        lockAuthor: string;
    };

    /**
     * An object with all validation erros.
     */
    validationErrors = VALIDATION_ERRORS;

    /**
     * Event which fires when lock form has loaded
     */
    @Output() onLoad = new EventEmitter<boolean>();

    /**
     * Event which fires if lock form has errors
     */
    @Output() onError = new EventEmitter<boolean>();

    /**
     * Event which fires if lock form has no errors
     */
    @Output() onSuccess = new EventEmitter<boolean>();

    /**
     * Event which fires if lock was toggled.
     */
    @Output() onToggle = new EventEmitter<boolean>();

    /**
     * Register form and it's controls
     */
    form = new FormGroup({
        lockReason: new FormControl({ value: '', disabled: true })
    });

    constructor(
        private service: LockService,
        private snackbar: MatSnackBar,
        private employeesService: AdministrationEmployeeService,
        private userService: UserService
    ) { }


    ngOnInit() {
        this.getLockReasons();
        this.getEntityLockStatus();

        this.onLoad.emit(true);
    }

    /**
     * Get lock reasons
     */
    getLockReasons() {
        this.isRequesting = true;

        return this.service
            .getLockReasons(this.entityType)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.lockReasons = response.data;
                    this.form.enable();
                },
                (error: Response) => {
                    this.onError.emit(true);
                    this.isRequesting = false;
                    this.form.enable();
                },
                () => (this.isRequesting = false)
            );
    }

    /**
     * Get entity lock status
     */
    getEntityLockStatus() {
        this.isRequesting = true;

        let get: Observable<BaseResponseInterface<any>>;

        switch (this.entityType) {
            case 'employee':
                get = this.employeesService.getEssentialData(this.entity.id);
                break;

            case 'user':
                get = this.userService.getLockStatus(this.entity.userId);
                break;
        }

        get.pipe(takeUntil(componentDestroyed(this))).subscribe(
            response => {

                this.entityLockStatus = {
                    isLocked: response.data.isLocked,
                    lockReasonName:
                        this.entityType === 'employee'
                            ? response.data.employeeLockReasonName
                            : response.data.userLockReasonName,
                    lockDate: response.data.lockDate,
                    lockAuthor: response.data.lockAuthor
                };

                this.onLoad.emit(true);
            },
            (error: Response) => (this.isRequesting = false),
            () => (this.isRequesting = false)
        );
    }

    /**
     * Lock entity
     * @param lockReasonId Lock reason ID
     */
    lock(lockReasonId: number) {
        if (!this.form.get('lockReason').value) {
            this.snackbar.open('Вы не выбрали причину блокировки');

            return false;
        }

        this.isRequesting = true;
        //Id or User id depending on entityType
        let id = this.entityType === 'employee' ? this.entity.id : this.entity.userId;
        this.service
            .lock(this.entityType, id, lockReasonId)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.getLockReasons();
                    this.getEntityLockStatus();

                    this.onSuccess.emit(true);
                    this.onToggle.emit(true);
                },
                (error: Response) => {
                    this.onSuccess.emit(false);
                    this.isRequesting = false;
                },
                () => {
                    this.isRequesting = false;

                    if (this.entityType === 'employee') this.snackbar.open('Сотрудник заблокирован');
                    else this.snackbar.open('Пользователь заблокирован');
                }
            );
    }

    /**
     * Unlock entity
     */
    unlock() {
        this.isRequesting = true;
        //Id or User id depending on entityType
        let id = this.entityType === 'employee' ? this.entity.id : this.entity.userId;
        this.service
            .unlock(this.entityType, id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.getLockReasons();
                    this.getEntityLockStatus();

                    this.entityLockStatus.isLocked = null;
                    this.onSuccess.emit(true);
                    this.onToggle.emit(false);
                },
                error => {
                    this.onSuccess.emit(false);
                    this.isRequesting = false;

                    if (error.status === 400) {
                        error.error.errors.forEach(error => {
                            if (error.code === 1009) this.snackbar.open(this.validationErrors[error.code]);
                        });
                    }
                },
                () => {
                    this.isRequesting = false;

                    if (this.entityType === 'employee') this.snackbar.open('Сотрудник разблокирован.');
                    else this.snackbar.open('Пользователь разблокирован.');
                }
            );
    }

    ngOnDestroy() { }
}
