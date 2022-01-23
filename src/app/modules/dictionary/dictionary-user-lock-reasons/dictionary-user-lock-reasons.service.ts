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
export interface DictionaryUserLockReasonsFetchCriterias {
    id?: number;
    name?: string;
    isActive?: boolean;
    onlyActive?: boolean;
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDir?: string;
}

export interface DictionaryUserLockReasons {
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
export class DictionaryUserLockReasonsService {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private http: HttpClient) { }

    // -------------------------------------------------------------------------
    // Get methods
    // -------------------------------------------------------------------------

    /**
     * Get userLockReasons list.
     * @param criterias Fetch criterias
     */
    getList(criterias?: DictionaryUserLockReasonsFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryUserLockReasons[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryUserLockReasons[]>>>>(
            environment.API.URL + 'UserLockReasons', { params: buildQueryParams(criterias) }
        );
    }

    /**
     *
     * @param id
     */
    getDictionaryUserLockReasonsById(id?: number): Observable<BaseResponseInterface<DictionaryUserLockReasons>> {
        return this.http.get<BaseResponseInterface<DictionaryUserLockReasons>>(environment.API.URL + 'UserLockReasons/' + id);
    }

    /**
     * Get logs of DictionariesSubValues.
     */
    getDictionaryUserLockReasonsLogs(id: number, criterias?: DictionaryUserLockReasonsFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryUserLockReasons[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryUserLockReasons[]>>>>(
            environment.API.URL + 'UserLockReasons/Logs/' + id, { params: buildQueryParams(criterias) }
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
    submit(action: string, payload: DictionaryUserLockReasons) {
        const endpoint = environment.API.URL + 'UserLockReasons';
        if (action === 'Create') return this.http.post(endpoint, payload);
        if (action === 'Edit') return this.http.put(endpoint, payload);
    }
}
