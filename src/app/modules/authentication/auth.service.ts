import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable, NgZone, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import BaseResponseInterface from '../common/interfaces/base-response.interface';
import { BootController } from '../common/boot-control';

/**
 * Sign-in credentials shape.
 */
export interface SignInCredentials {
    rememberMe: boolean;
    phoneNumber: number;
    password: string;
}

/**
 * Reset password credentials shape.
 */
export interface ResetPasswordCredentials {
    phoneNumber: string;
}

/**
 * Sign-in response shape.
 */
export interface SignInResponse {
    token: string;
    refreshToken: string;
}

export let InjectorInstance: Injector;

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    /**
     * Determines whether refresh token is in progress.
     */
    static isRefreshingToken = false;

    constructor(
        private http: HttpClient,
        public jwtHelper: JwtHelperService,
        private router: Router,
        private ngZone: NgZone,
        private injector: Injector
    ) {
        InjectorInstance = this.injector;
    }

    /**
     * Sign-in
     * @param credentials Sign-in credentials.
     * @returns true | false – on success | error – respectively.
     */
    signIn(credentials: SignInCredentials): Observable<boolean> {
        return this.http
            .post<BaseResponseInterface<SignInResponse>>(
                environment.API.LOGIN,
                JSON.stringify(credentials),{
                    observe: 'response'
                }
            )
            .pipe(
                map(response => {
                    if (response.status === 200) {
                        AuthService.storeTokens(response.body.data.token, response.body.data.refreshToken);
                        return true;
                    }

                    return false;
                })
            );
    }

    /**
     * Sign-out.
     */
    signOut() {
        this.removeTokens();
        this.router.navigate(['/auth']);

        // Triggers the reboot in main.ts
        this.ngZone.runOutsideAngular(() => BootController.getbootControl().restart());
    }

    /**
     * Detemines if user signed-in and auth token is valid
     * @returns true if user signed in and token is valid, false if token
     * is expired.
     */
    isSignedIn() {
        const token = this.getToken('auth');

        if (!token) return false;

        const isExpired = this.jwtHelper.isTokenExpired(token);

        return !isExpired;
    }

    /**
     * Reset password.
     * @param credentials Reset password credentials.
     * @returns true | false – on success | error – respectively.
     */
    resetPassword(credentials: ResetPasswordCredentials): Observable<boolean> {
        return this.http
            .post<BaseResponseInterface<any>>(
                environment.API.URL + 'Account/ResetPassword',
                JSON.stringify(credentials),{
                    observe: 'response'
                }
            )
            .pipe(
                map(response => {
                    return response.status === 200;
                })
            );
    }

    /**
     * Refresh JWT.
     * @returns New tokens.
     */
    static refreshToken(): Observable<BaseResponseInterface<SignInResponse>> {
        const http = InjectorInstance.get<HttpClient>(HttpClient);

        //if (!this.isRefreshingToken) {
        this.isRefreshingToken = true;
        setTimeout(() => (this.isRefreshingToken = false), 15000);
        return http
            .post<BaseResponseInterface<SignInResponse>>(environment.API.REFRESH_TOKEN, {
                token: localStorage.getItem('auth_token'),
                refreshToken: localStorage.getItem('refresh_token')
            })
            .pipe(
                tap(response => {
                    this.isRefreshingToken = false;
                    this.storeTokens(response.data.token, response.data.refreshToken);
                })
            );
        //}
    }

    /**
     * Get auth or refresh token.
     * @param type Type of the token to return (auth || refresh).
     * @returns Auth or refresh token as string.
     */
    getToken(type = 'auth'): string {
        return type === 'auth' ? localStorage.getItem('auth_token') : localStorage.getItem('refresh_token');
    }

    /**
     * Remove tokens.
     */
    removeTokens() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
    }

    /**
     * Save tokens.
     * @param auth Auth token.
     * @param refresh Refresh token.
     */
    static storeTokens(auth: string, refresh: string) {
        localStorage.setItem('auth_token', auth);
        localStorage.setItem('refresh_token', refresh);
    }
}
