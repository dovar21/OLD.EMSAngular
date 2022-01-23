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
export interface DictionaryTareFetchCriterias {
    id?: number;
    name?: string;
    isActive?: boolean;
    onlyActive?: boolean;
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDir?: string;
}

export interface DictionaryTare {
    id?: number;
    name: string;
    rootId?: number;
    isActive?: boolean;
    lastModifiedAuthor?: string;
    lastModifiedAt?: string;
    author?: string;
    createdAt?: string;
}

export interface DictionaryTareAutocomplete {
    id: number;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class DictionaryTareService {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private http: HttpClient) { }

    // -------------------------------------------------------------------------
    // Get methods
    // -------------------------------------------------------------------------

    /**
     * Get dictionary-tare list.
     * @param criterias Fetch criterias
     */
    getList(criterias?: DictionaryTareFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryTare[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryTare[]>>>>(
            environment.API.URL + 'Tare', { params: buildQueryParams(criterias) }
        );
    }

    /**
     *
     * @param id
     */
    getDictionaryTareById(id?: number): Observable<BaseResponseInterface<DictionaryTare>> {
        return this.http.get<BaseResponseInterface<DictionaryTare>>(environment.API.URL + 'Tare/' + id);
    }

    /**
     * Get total list of given dictionary items.
     */
    getDictionaryTareAutocomplete(): Observable<BaseResponseInterface<DictionaryTareAutocomplete[]>> {
        return this.http.get<BaseResponseInterface<DictionaryTareAutocomplete[]>>(environment.API.URL + 'Tare/SelectListItems');
    }

    /**
     * Get logs of DictionariesSubValues.
     */
    getDictionaryTareLogs(id: number, criterias?: DictionaryTareFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryTare[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryTare[]>>>>(
            environment.API.URL + 'Tare/Logs/' + id, { params: buildQueryParams(criterias) }
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
    submit(action: string, payload: DictionaryTare) {
        const endpoint = environment.API.URL + 'Tare';
        if (action === 'Create') return this.http.post(endpoint, payload);
        if (action === 'Edit') return this.http.put(endpoint, payload);
    }
}
