import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import BaseResponseInterface from '../../common/interfaces/base-response.interface';
import {MatTableDataSource} from '@angular/material';
import {buildQueryParams} from '../../common/utils';
import PaginationItems from '../../common/interfaces/pagination-items.interface';

/**
 * The shape of fetch criterias for DB searching
 */
export interface DictionaryEmployeeLockReasonsFetchCriterias {
    id?: number;
    name?: string;
    isActive?: boolean;
    onlyActive?: boolean;
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDir?: string;
}

export interface DictionaryEmployeeLockReasons {
    id?: number;
    name: string;
    rootId?: number;
    isActive?: boolean;
    lastModifiedAuthor?: string;
    lastModifiedAt?: string;
    author?: string;
    createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class DictionaryEmployeeLockReasonsService {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private http: HttpClient) { }

    // -------------------------------------------------------------------------
    // Get methods
    // -------------------------------------------------------------------------

    /**
     * Get employeeLockReasons list.
     * @param criterias Fetch criterias
     */
    getList(criterias?: DictionaryEmployeeLockReasonsFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryEmployeeLockReasons[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryEmployeeLockReasons[]>>>>(
            environment.API.URL + 'EmployeeLockReasons', { params: buildQueryParams(criterias) }
        );
    }

    /**
     *
     * @param id
     */
    getDictionaryEmployeeLockReasonsById(id?: number): Observable<BaseResponseInterface<DictionaryEmployeeLockReasons>> {
        return this.http.get<BaseResponseInterface<DictionaryEmployeeLockReasons>>(environment.API.URL + 'EmployeeLockReasons/' + id);
    }

    /**
     * Get logs of DictionariesSubValues.
     */
    getDictionaryEmployeeLockReasonsLogs(id: number, criterias?: DictionaryEmployeeLockReasonsFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryEmployeeLockReasons[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryEmployeeLockReasons[]>>>>(
            environment.API.URL + 'EmployeeLockReasons/Logs/' + id, { params: buildQueryParams(criterias) }
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
    submit(action: string, payload: DictionaryEmployeeLockReasons) {
        const endpoint = environment.API.URL + 'EmployeeLockReasons';
        if (action === 'Create') return this.http.post(endpoint, payload);
        if (action === 'Edit') return this.http.put(endpoint, payload);
    }
}
