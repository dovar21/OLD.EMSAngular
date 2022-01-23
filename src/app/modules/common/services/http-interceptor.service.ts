import { Injectable } from '@angular/core';
import {
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpHeaders,
    HttpSentEvent,
    HttpHeaderResponse,
    HttpProgressEvent,
    HttpResponse,
    HttpUserEvent,
    HttpErrorResponse,
    HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, flatMap, tap } from 'rxjs/operators';
import { AuthService } from '../../authentication/auth.service';
import { DashboardLayoutComponent } from '../../../layout/dashboard-layout/dashboard-layout.component';
import { MatSnackBar } from '@angular/material';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class GlobalHttpHeadersInterceptorService implements HttpInterceptor {
    /**
     * Access dashboard layout props.
     */
    private dashboardLayout = DashboardLayoutComponent;

    constructor(private authService: AuthService, private snackbar: MatSnackBar, private jwtHelper: JwtHelperService) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<
        HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any
    > {
        request = this.setContentType(request);
        request = this.addAuthToken(request, this.authService.getToken());

        // Defer progress-bar display to get rid of 'ExpressionChangedAfterItHasBeenCheckedError'
        setTimeout(() => (this.dashboardLayout.isRequesting = true));

        return next.handle(request).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) this.dashboardLayout.isRequesting = false;
            }),
            catchError((error: HttpErrorResponse) => {
                this.dashboardLayout.isRequesting = false;

                switch (error.status) {
                    case 0:
                        this.snackbar.open('Ошибка. Проверьте подключение к Интернету или настройки Firewall.');
                        break;

                    case 401:
                        return this.refreshToken(request, next);
                }

                if (error.status >= 500) {
                    this.snackbar.open(`Ошибка ${error.status}. Попробуйте еще раз или обратитесь к администратору.`);
                }

                return throwError(error);
            })
        );
    }

    /**
     * Set Content-Type header to passed request.
     * @param request Http request to set header.
     */
    private setContentType(request: HttpRequest<any>): HttpRequest<any> {
        if (!(request.body instanceof FormData)) {
            request = request.clone({
                headers: new HttpHeaders({ 'Content-Type': 'application/json' })
            });
        }

        return request;
    }

    /**
     * Add auth token to given request.
     * @param request Request object.
     * @param token Auth token.
     */
    private addAuthToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
        if (this.authService.isSignedIn() && !this.isBlacklistedEndpoint(request.url))
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });

        return request;
    }

    /**
     * Refresh token.
     * @param request Request object.
     * @param next HTTP next handler.
     */
    private refreshToken(request: HttpRequest<any>, next: HttpHandler) {
        if (!AuthService.isRefreshingToken) {
            return AuthService.refreshToken().pipe(
                flatMap(response => {
                    request = this.addAuthToken(request, response.data.token);

                    return next.handle(request);
                }),
                catchError((error: HttpErrorResponse) => {
                    if (this.isBlacklistedEndpoint(error.url)) this.authService.signOut();

                    return throwError(error);
                })
            );
        }
    }

    /**
     * Determines whether token should not be sent among with the request.
     * @param url Request URL.
     * @returns Boolean.
     */
    private isBlacklistedEndpoint(url: string): boolean {
        // const blacklistedEndpoints = [environment.API.REFRESH_TOKEN, environment.API.LOGIN];
        // return blacklistedEndpoints.includes(url);
        return url.indexOf('RefreshToken') > 0;
    }
}
