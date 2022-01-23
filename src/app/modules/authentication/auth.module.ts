import { environment } from '../../../environments/environment';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthComponent } from './auth.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MaterialModule } from '../../material/material.module';
import { MatProgressBarModule } from '@angular/material';

export function jwtTokenGetter() {
    return localStorage.getItem('access_token');
}

@NgModule({
    declarations: [AuthComponent, SignInComponent, ResetPasswordComponent],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatProgressBarModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: jwtTokenGetter,
                whitelistedDomains: environment.JWT.whitelistedDomains,
                blacklistedRoutes: environment.JWT.blacklistedRoutes
            }
        })
    ],
    exports: [AuthComponent, SignInComponent]
})
export class AuthModule {}
