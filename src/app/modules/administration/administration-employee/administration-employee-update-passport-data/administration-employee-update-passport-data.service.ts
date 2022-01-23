import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import BaseResponseInterface from 'src/app/modules/common/interfaces/base-response.interface';

/**
 * Shape of passport data to be fetched and sent
 */
export interface PassportData {
    passportScanPath: string;
    passportNumber: string;
    passportIssuer: string;
    passportIssueDate: string;
    nationalityId: number;
    nationality: string;
    dateOfBirth: string;
    passportAddress: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdministrationEmployeeUpdatePassportDataService {
    constructor(private http: HttpClient) { }

    /**
     * Get AdministrationEmployee passport data
     * @param id AdministrationEmployee ID
     */
    get(id: number): Observable<BaseResponseInterface<PassportData>> {
        return this.http.get<BaseResponseInterface<PassportData>>(
            environment.API.URL + 'Employees/PassportData/' + id
        );
    }

    /**
     * Submit AdministrationEmployee passport data
     * @param payload PassportData
     */
    submit(payload: FormData): Observable<BaseResponseInterface<any>> {
        return this.http.post<BaseResponseInterface<any>>(environment.API.URL + 'Employees/PassportData', payload);
    }
}
