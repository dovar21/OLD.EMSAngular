import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import BaseResponseInterface from 'src/app/modules/common/interfaces/base-response.interface';

interface ChangePassword {
    confirmationCode: number;
    password: string;
    confirmPassword: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChangePasswordService {
    constructor(private http: HttpClient) {}

    /**
     * Request confirmation code
     */
    requestConfirmationCode(): Observable<BaseResponseInterface<any>> {
        return this.http.post<BaseResponseInterface<any>>(
            environment.API.URL + 'Account/SendChangePasswordConfirmationCode',
            {}
        );
    }

    /**
     * Change password
     */
    changePassword(payload: ChangePassword): Observable<BaseResponseInterface<any>> {
        return this.http.post<BaseResponseInterface<any>>(
            environment.API.URL + 'Account/ChangePassword',
            JSON.stringify(payload)
        );
    }
}
