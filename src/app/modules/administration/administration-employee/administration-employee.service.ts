import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import BaseResponseInterface from 'src/app/modules/common/interfaces/base-response.interface';
import { MatTableDataSource } from '@angular/material';
import { buildQueryParams } from 'src/app/modules/common/utils';
import { PassportData } from './administration-employee-update-passport-data/administration-employee-update-passport-data.service';
import { map } from 'rxjs/operators';

/**
 * Shape of essential administration-employee-view data that gets populated
 * to 'Главное' tab
 */
export interface AdministrationEmployeeEssentialData {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfBirth: string;
    description: string;
    factualAddress: string;
    genderName: string;
    hireDate: string;
    employeeLockReasonName: string;
    lockDate: string;
    lockAuthor: string;
    genderId: number;
    departmentId: number;
    positionId: number;
    photoPath: string;
    createdAt: string;
    lastModifiedAuthor: string;
    lastModifiedAt: string;
    photoPathSmall: string;
    fullName: string;
    department: string;
    position: string;
    userId: string;
    phone: string;
    email: string;
}

/**
 * Shape of log data that gets populated to widget
 */
export interface AdministrationEmployeeLog {
    authorName: string;
    createdAt: string;
    lastEdit: string;
}

/**
 * The shape of fetched AdministrationEmployee
 */
export interface AdministrationEmployee {
    id: number;
    photoPath: string;
    fullName: string;
    department: string;
    position: string;
    userId: boolean;
    phone: string;
    email: string;
    hireDate?: Date;
    lockDate?: Date;
    lockReason?: string;
    photoPathSmall: string;
}

interface Employees<T> {
    items: T;
    page: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
}

/**
 * The shape of fetch criterias for DB searching
 */
export interface AdministrationEmployeeFetchCriterias {
    fullName?: string;
    departmentId?: number;
    onlyUsers?: boolean;
    page?: number;
    pageSize?: number;
    locked?: boolean;
}

/**
 * The shape of export criterias
 */
export interface AdministrationEmployeeExportCriterias {
    fullName?: string;
    departmentId?: number;
    onlyUsers?: boolean;
    sortProperty?: any;
    sortDir?: string;
}

export interface AutocompleteAdministrationEmployee {
    id: number;
    photo: string;
    fullName: string;
    department: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdministrationEmployeeService {
    constructor(private http: HttpClient) {}

    /**
     * Get administration-employee list.
     * @param criterias Fetch criterias
     */
    get(criterias?: AdministrationEmployeeFetchCriterias): Observable<BaseResponseInterface<Employees<MatTableDataSource<AdministrationEmployee[]>>>> {
        let ENDPOINT = 'Employees/';

        if (criterias) {
            if (criterias.locked) ENDPOINT = 'Employees/Locked/';

            return this.http.get<BaseResponseInterface<Employees<MatTableDataSource<AdministrationEmployee[]>>>>(
                environment.API.URL + ENDPOINT, { params: buildQueryParams(criterias) }
            );
        } else {
            return this.http.get<BaseResponseInterface<Employees<MatTableDataSource<AdministrationEmployee[]>>>>(
                environment.API.URL + ENDPOINT
            );
        }
    }

    /**
     * Export administration-employee list.
     * @param criterias Export criterias.
     */
    exportCriterias(criterias: AdministrationEmployeeExportCriterias) {
        return this.http.get(environment.API.URL + 'Employees/ExportExcel', {
            params: buildQueryParams(criterias),
            responseType: 'blob',
            observe: 'response'
        });
    }

    /**
     * Get AdministrationEmployee essential data
     * @param id AdministrationEmployee ID
     */
    getEssentialData(id: number): Observable<BaseResponseInterface<AdministrationEmployeeEssentialData>> {
        return this.http.get<BaseResponseInterface<AdministrationEmployeeEssentialData>>(environment.API.URL + 'Employees/' + id);
    }

    /**
     * Get AdministrationEmployee passport data
     * @param id AdministrationEmployee ID
     */
    getPassportData(id: number): Observable<BaseResponseInterface<PassportData>> {
        return this.http.get<BaseResponseInterface<PassportData>>(environment.API.URL + 'Employees/PassportData/' + id);
    }

    /**
     * Get AdministrationEmployee and User log data
     * @param id AdministrationEmployee ID
     */
    getLog(id: number): AdministrationEmployeeLog {
        return {
            authorName: 'Мирзоев К. О.',
            createdAt: '22.06.2019',
            lastEdit: '5.07.2019, 12:32'
        };
    }

    /**
     * Export administration-employee-view as file.
     * @param id AdministrationEmployee ID.
     */
    export(id: number) {
        return this.http.get(environment.API.URL + 'Employees/ExportPDF/' + id, {
            responseType: 'blob',
            observe: 'response'
        });
    }

    /**
     * Get users for compose autocomplete.
     */
    getEmployeesAutocomplete(): Observable<BaseResponseInterface<AutocompleteAdministrationEmployee[]>> {
        return this.http.get<BaseResponseInterface<AutocompleteAdministrationEmployee[]>>(
            environment.API.URL + 'Employees/AutocompleteItems'
        );
    }
}
