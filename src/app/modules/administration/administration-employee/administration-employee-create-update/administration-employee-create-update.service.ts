import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import BaseResponseInterface from 'src/app/modules/common/interfaces/base-response.interface';

/**
 * Fetched AdministrationEmployee shape for editing
 */
export interface Employee {
    id: number;
    photo: any;
    lastName: string;
    firstName: string;
    middleName: string;
    dateOfBirth: string;
    genderId: number;
    hireDate: string;
    positionId: number;
    phone: string;
    email: string;
    factualAddress: string;
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdministrationEmployeeCreateUpdateService {
    constructor(private http: HttpClient) { }

    /**
     * Create or edit administration-employee-view
     * @param action A string determining action type (Create || Edit)
     * @param payload Request payload
     */
    submit(action: string, payload: FormData): Observable<BaseResponseInterface<Employee>> {
        const endpoint = environment.API.URL + 'Employees';
        if (action === 'Create') return this.http.post<BaseResponseInterface<Employee>>(endpoint, payload);
        if (action === 'Edit') return this.http.put<BaseResponseInterface<Employee>>(endpoint, payload);
    }
}
