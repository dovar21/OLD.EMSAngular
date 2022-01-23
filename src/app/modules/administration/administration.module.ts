import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MyProfileComponent } from './users/my-profile/my-profile.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { FunctionalityAccessPermissionsComponent } from './users/functionality-access-permissions/functionality-access-permissions.component';
import { LockFormComponent } from './lock-form/lock-form.component';
import { CreateEmployeeComponent } from './administration-employee/administration-employee-create-update/administration-employee-create-update.component';
import { AdministrationEmployeeUpdatePassportDataComponent } from './administration-employee/administration-employee-update-passport-data/administration-employee-update-passport-data.component';
import { AdministrationEmployeeViewComponent } from './administration-employee/administration-employee-view/administration-employee-view.component';
import { AdministrationEmployeeFilterComponent } from './administration-employee/administration-employee-filter/administration-employee-filter.component';
import { AdministrationEmployeeListComponent } from './administration-employee/administration-employee-list/administration-employee-list.component';
import { UserComponent } from './users/user/user.component';
import { MaterialModule } from '../../material/material.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonComponentsModule } from '../common/components/common-components.module';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { SmtpComponent } from './system-settings/smtp/smtp.component';
import { ConfigFormComponent } from './system-settings/smtp/config-form/config-form.component';
import { SmppComponent } from './system-settings/smpp/smpp.component';
import { SmppConfigFormComponent } from './system-settings/smpp/smpp-config-form/config-form.component';
import { EmailListComponent } from './history/email/email-list/email-list.component';
import { SmsComponent } from './history/sms/sms.component';
import { SmsFilterComponent } from './history/sms/sms-filter/sms-filter.component';
import { EmailFilterListComponent } from './history/email/email-filter-list/email-filter-list.component';
import { EmailFilterComponent } from './history/email/email-filter/email-filter.component';
import { AdministrationEmployeeFilterListComponent } from './administration-employee/administration-employee-filter-list/administration-employee-filter-list.component';
import { CropperImageModule } from '../common/cropper-image/cropper-image.module';
@NgModule({
    declarations: [
        AdministrationEmployeeListComponent,
        AdministrationEmployeeFilterComponent,
        AdministrationEmployeeFilterListComponent,
        AdministrationEmployeeViewComponent,
        UserComponent,
        LockFormComponent,
        CreateEmployeeComponent,
        AdministrationEmployeeUpdatePassportDataComponent,
        MyProfileComponent,
        ChangePasswordComponent,
        FunctionalityAccessPermissionsComponent,
        SystemSettingsComponent,
        SmtpComponent,
        ConfigFormComponent,
        SmppComponent,
        SmppConfigFormComponent,
        EmailListComponent,
        EmailFilterComponent,
        EmailFilterListComponent,
        SmsComponent,
        SmsFilterComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        PerfectScrollbarModule,
        ReactiveFormsModule,
        CommonComponentsModule,
        CropperImageModule
    ],
    exports: [UserComponent],

    entryComponents: [
        EmailFilterComponent,
        AdministrationEmployeeFilterComponent,
    ]
})
export class AdministrationModule {}
