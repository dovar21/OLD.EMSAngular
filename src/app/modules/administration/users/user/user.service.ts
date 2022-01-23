import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import BaseResponseInterface from 'src/app/modules/common/interfaces/base-response.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserLockStatus } from '../../lock-form/lock.service';

/**
 * Shape of user data
 */
export interface User {
    userId: string;
    phoneNumber?: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    /**
     * Create user based on administration-employee-view
     * @param employeeId AdministrationEmployee ID
     */
    createUser(employeeId: number): Observable<BaseResponseInterface<User>> {

        return this.http.post<BaseResponseInterface<User>>(
            environment.API.URL + 'Employees/CreateUser/' + employeeId,
            {}
        );
    }

    /**
     * Get user lock status
     * @param id User ID
     */
    getLockStatus(id: number | string): Observable<BaseResponseInterface<UserLockStatus>> {
        return this.http.get<BaseResponseInterface<UserLockStatus>>(environment.API.URL + 'Account/LockStatus/' + id);
    }
}
