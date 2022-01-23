import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatTabChangeEvent, MatSnackBar, MatDialog } from '@angular/material';
import { DashboardLayoutComponent } from 'src/app/layout/dashboard-layout/dashboard-layout.component';
import { SidenavStateService } from 'src/app/layout/dashboard-layout/sidenav-state.service';
import { AdministrationEmployeeUpdatePassportDataService, PassportData } from '../administration-employee-update-passport-data/administration-employee-update-passport-data.service';
import { fade } from 'src/app/animations/all';
import { UserService } from '../../users/user/user.service';
import { downloadFileFromBlob, openDialogLightbox, componentDestroyed } from 'src/app/modules/common/utils';
import { takeUntil } from 'rxjs/operators';
import { PermissionsService } from 'src/app/modules/authentication/permissions.service';
import { UserLockStatus } from '../../lock-form/lock.service';
import {AdministrationEmployeeService, AdministrationEmployeeEssentialData, AdministrationEmployeeLog} from '../administration-employee.service';

@Component({
    selector: 'administration-employee-view',
    templateUrl: './administration-employee-view.component.html',
    styleUrls: ['./administration-employee-view.component.sass'],
    animations: [fade]
})
export class AdministrationEmployeeViewComponent implements OnInit, AfterViewInit, OnDestroy {
    /**
     * Determines, whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * AdministrationEmployee ID.
     */
    id: number;

    /**
     * AdministrationEmployee data that gets populated to 'Главное' tab.
     */
    essentialData: AdministrationEmployeeEssentialData;

    /**
     * Passport data that gets populated to 'Паспортные данные' tab.
     */
    passportData: PassportData;

    /**
     * User data that gets populated to 'Учетная запись' tab.
     */
    userData: UserLockStatus;

    /**
     * AdministrationEmployeeLog data that gets populated to right side widget.
     */
    logData: AdministrationEmployeeLog;

    /**
     * Active tab title. Initially set to 'Главное' to fetch essential
     * data straight away.
     */
    activeTabLabel = 'Главное';

    /**
     * Active tab index.
     */
    activeTabIndex: number;

    /**
     * Determines if sidebar is opened.
     */
    isSidebarOpened: boolean;

    /**
     * Determines if administration-employee-view has passport data.
     */
    hasPassport = false;

    /**
     * Determines whether lock form is loaded.
     */
    lockFormLoaded: boolean;

    /**
     * Granted permissions.
     */
    permissions: any;

    constructor(
        private route: ActivatedRoute,
        private service: AdministrationEmployeeService,
        public location: Location,
        private dashboardLayout: DashboardLayoutComponent,
        private sidenavStateService: SidenavStateService,
        private passportDataService: AdministrationEmployeeUpdatePassportDataService,
        private userService: UserService,
        public dialog: MatDialog,
        private permissionsService: PermissionsService
    ) { }

    ngOnInit() {
        this.permissions = this.permissionsService.grantedPermissions;

        this.route.paramMap.pipe(takeUntil(componentDestroyed(this))).subscribe(params => (this.id = +params.get('id')));

        this.getEssentialData(this.id);

        // Fetch and assign log data
        this.logData = this.getLogData(this.id);

        this.sidenavStateService.onSideNavToggle
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(() => (this.isSidebarOpened = this.dashboardLayout.isSidebarOpened));
    }

    ngAfterViewInit() {
        this.activeTabIndex = +this.route.snapshot.queryParamMap.get('activeTabIndex');

        switch (this.activeTabIndex) {
            case 1:
                this.getPassportData(this.id);
                this.activeTabLabel = 'Паспортные данные';
                break;

            case 2:
                this.getUserData(this.id);
                this.activeTabLabel = 'Учетная запись';
                break;
        }
    }

    /**
     * Get essential data.
     * @param id AdministrationEmployee ID
     */
    getEssentialData(id: number) {
        this.service
            .getEssentialData(id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => (this.essentialData = response.data), (error: Response) => this.location.back());
    }

    /**
     * Open lightbox with passed photo and name.
     * @param photoPath Photo path.
     * @param fullName Full name.
     */
    openDialogLightbox(photoPath: string, fullName: string) {
        openDialogLightbox(photoPath, fullName, this.dialog);
    }

    /**
     * Get passport data.
     * @param id AdministrationEmployee ID
     */
    getPassportData(id: number) {
        return this.passportDataService
            .get(id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.passportData = response.data;

                if (response.data.passportNumber) this.hasPassport = true;
            });
    }

    /**
     * Get user data.
     * @param id AdministrationEmployee ID
     */
    getUserData(id: number) {
        this.userService
            .getLockStatus(id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => (this.userData = response.data));
    }

    /**
     * Get log data.
     * @param id AdministrationEmployee ID
     */
    getLogData(id: number): AdministrationEmployeeLog {
        return this.service.getLog(id);
    }

    /**
     * Export given data to file (PDF)
     */
    export() {
        this.isRequesting = true;

        this.service
            .export(this.id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => downloadFileFromBlob(response.headers.get('content-disposition'), response.body),
                (error: Response) => (this.isRequesting = false),
                () => (this.isRequesting = false)
            );
    }

    /**
     * Catch MatTabGroup tab change
     * @param event Event object
     */
    catchTabChange(event: MatTabChangeEvent) {
        switch (event.tab.textLabel) {
            case 'Главное':
                this.getEssentialData(this.id);
                break;

            case 'Паспортные данные':
                this.getPassportData(this.id);
                break;

            case 'Учетная запись':
                this.getUserData(this.id);
                break;
        }

        this.activeTabLabel = event.tab.textLabel;
    }

    ngOnDestroy() { }
}
