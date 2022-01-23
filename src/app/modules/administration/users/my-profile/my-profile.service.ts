import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import BaseResponseInterface from 'src/app/modules/common/interfaces/base-response.interface';
import { environment } from 'src/environments/environment';

/**
 * Shape of the employee data
 */
export interface EmployeeData {
    author: string;
    dateOfBirth: string;
    description: string;
    factualAddress: string;
    genderName: string;
    hireDate: string;
    departmentName: string;
    positionName: string;
    phone: string;
    email: string;
    photoPath: string;
    photoPathSmall: string;
}

/**
 * Shape of the editing employee data request
 */
export interface EditEmployeeData {
    email: string;
    factualAddress: string;
}

@Injectable({
    providedIn: 'root'
})
export class MyProfileService {
    constructor(private http: HttpClient) { }

    /**
     * Get Employee essential data
     */
    getEmployeeData(): Observable<BaseResponseInterface<EmployeeData>> {
        return this.http.get<BaseResponseInterface<EmployeeData>>(environment.API.URL + 'Account/MyInfo');
    }

    /**
     * Edit employee / user shared data
     */
    editUserDetails(payload: EditEmployeeData): Observable<BaseResponseInterface<any>> {
        return this.http.put<BaseResponseInterface<any>>(environment.API.URL + 'Account', JSON.stringify(payload));
    }
}
