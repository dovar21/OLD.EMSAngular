import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import BaseResponseInterface from '../../common/interfaces/base-response.interface';
import { MatTableDataSource } from '@angular/material';
import { buildQueryParams } from '../../common/utils';
import PaginationItems from '../../common/interfaces/pagination-items.interface';

/**
 * The shape of fetch criterias for DB searching
 */
export interface DepartmentsFetchCriterias {
    id?: number;
    name?: string;
    isActive?: boolean;
    onlyActive?: boolean;
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDir?: string;
}

export interface Department {
    id?: number;
    name: string;
    rootId?: number;
    isActive?: boolean;
    lastModifiedAuthor?: string;
    lastModifiedAt?: string;
    author?: string;
    createdAt?: string;
}

export interface AutocompleteDepartment {
    id: number;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class DictionaryDepartmentsService {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private http: HttpClient) { }

    // -------------------------------------------------------------------------
    // Get methods
    // -------------------------------------------------------------------------

    /**
     * Get dictionary-departments list.
     * @param criterias Fetch criterias
     */
    getList(criterias?: DepartmentsFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<Department[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<Department[]>>>>(
            environment.API.URL + 'Departments', { params: buildQueryParams(criterias) }
        );
    }

    /**
     * Get total list of given dictionary items.
     */
    getDepartmentsSelectItems(): Observable<BaseResponseInterface<AutocompleteDepartment[]>> {
        return this.http.get<BaseResponseInterface<AutocompleteDepartment[]>>(environment.API.URL + 'Departments/SelectListItems');
    }

    /**
     *
     * @param id
     */
    getDepartmentsById(id?: number): Observable<BaseResponseInterface<Department>> {
        return this.http.get<BaseResponseInterface<Department>>(environment.API.URL + 'Departments/' + id);
    }

    /**
     * Get logs of DictionariesSubValues.
     */
    getDepartmentsLogs(id: number, criterias?: DepartmentsFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<Department[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<Department[]>>>>(
            environment.API.URL + 'Departments/Logs/' + id, { params: buildQueryParams(criterias) }
        );
    }

    // -------------------------------------------------------------------------
    // Create or Update methods
    // -------------------------------------------------------------------------

    /**
     *
     * @param action The type of job to do (Create | Edit)
     * @param payload Form value
     */
    submit(action: string, payload: Department) {
        const endpoint = environment.API.URL + 'Departments';
        if (action === 'Create') return this.http.post(endpoint, payload);
        if (action === 'Edit') return this.http.put(endpoint, payload);
    }
}
