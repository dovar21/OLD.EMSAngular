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
export interface DictionaryProductClassificationCodesFetchCriterias {
    id?: number;
    name?: string;
    isActive?: boolean;
    onlyActive?: boolean;
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDir?: string;
}

export interface DictionaryProductClassificationCode {
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
export class DictionaryProductClassificationCodesService {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private http: HttpClient) { }

    // -------------------------------------------------------------------------
    // Get methods
    // -------------------------------------------------------------------------

    /**
     * Get productsClassificationCodes list.
     * @param criterias Fetch criterias
     */
    getList(criterias?: DictionaryProductClassificationCodesFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryProductClassificationCode[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryProductClassificationCode[]>>>>(
            environment.API.URL + 'ProductClassificationCodes', { params: buildQueryParams(criterias) }
        );
    }

    /**
     *
     * @param id
     */
    getDictionaryProductsClassificationCodesById(id?: number): Observable<BaseResponseInterface<DictionaryProductClassificationCode>> {
        return this.http.get<BaseResponseInterface<DictionaryProductClassificationCode>>(environment.API.URL + 'ProductClassificationCodes/' + id);
    }

    /**
     * Get logs of DictionariesSubValues.
     */
    getDictionaryProductsClassificationCodesLogs(id: number, criterias?: DictionaryProductClassificationCodesFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryProductClassificationCode[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryProductClassificationCode[]>>>>(
            environment.API.URL + 'ProductClassificationCodes/Logs/' + id, { params: buildQueryParams(criterias) }
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
    submit(action: string, payload: DictionaryProductClassificationCode) {
        const endpoint = environment.API.URL + 'ProductClassificationCodes';
        if (action === 'Create') return this.http.post(endpoint, payload);
        if (action === 'Edit') return this.http.put(endpoint, payload);
    }
}
