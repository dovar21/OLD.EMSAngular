import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Route } from '@angular/compiler/src/core';
import { map, catchError, flatMap, mergeMap, tap } from 'rxjs/operators';
import { throwError, Observable, Subject, timer } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from '../administration/users/user/user.service';
import { request } from 'http';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        private jwtHelper: JwtHelperService,
        private userService: UserService
    ) { }

    /**
     * Guards routes from unauthorized access.
     * @param route Route that user wants to navigate.
     * @param state Router state snapshot.
     */
    canActivate(route: Route, state: RouterStateSnapshot): Observable<boolean> | boolean {
        //return true;
        if (this.authService.isSignedIn()) return true;
        else if (this.authService.getToken() && this.authService.getToken('refresh')) {
            const currentUserId = this.jwtHelper.decodeToken(this.authService.getToken()).id;
            return this.userService.getLockStatus(currentUserId).pipe(
                map(response => {
                    return true;
                })
            );
        } else this.cantActivate(state);

        // if (this.authService.getToken() && this.authService.getToken('refresh')) {
        //     if (!AuthService.isRefreshingToken) {
        //         return AuthService.refreshToken().pipe(
        //             map(response => {
        //                 if (response.meta.success) return true;
        //                 else return false;
        //             }),
        //             catchError((error: HttpErrorResponse) => {
        //                 this.cantActivate(state);
        //                 return throwError(error);
        //             })
        //         );
        //     } else {
        //         AuthService.refreshToken().subscribe(response => this.canActivate(route, state));
        //     }
        // } else {
        //     this.cantActivate(state);
        //     return false;
        // }
    }

    /**
     * Redirect user to sign in route.
     * @param state Router sate snapshot.
     */
    cantActivate(state: RouterStateSnapshot): boolean {
        this.authService.signOut();

        return false;
    }
}
