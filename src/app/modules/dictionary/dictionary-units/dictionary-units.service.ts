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
export interface DictionaryUnitsFetchCriterias {
    id?: number;
    name?: string;
    isActive?: boolean;
    onlyActive?: boolean;
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDir?: string;
}

export interface DictionaryUnit {
    id?: number;
    name: string;
    rootId?: number;
    isActive?: boolean;
    lastModifiedAuthor?: string;
    lastModifiedAt?: string;
    author?: string;
    createdAt?: string;
}

export interface AutocompleteUnits {
    id: number;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class DictionaryUnitsService {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private http: HttpClient) { }

    // -------------------------------------------------------------------------
    // Get methods
    // -------------------------------------------------------------------------

    /**
     * Get dictionary-units list.
     * @param criterias Fetch criterias
     */
    getList(criterias?: DictionaryUnitsFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryUnit[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryUnit[]>>>>(
            environment.API.URL + 'Units', { params: buildQueryParams(criterias) }
        );
    }

    /**
     * Get total list of given dictionary items.
     */
    getAutocompleteDictionaryUnits(): Observable<BaseResponseInterface<AutocompleteUnits[]>> {
        return this.http.get<BaseResponseInterface<AutocompleteUnits[]>>(environment.API.URL + 'Units/SelectListItems');
    }

    /**
     *
     * @param id
     */
    getDictionaryUnitsById(id?: number): Observable<BaseResponseInterface<DictionaryUnit>> {
        return this.http.get<BaseResponseInterface<DictionaryUnit>>(environment.API.URL + 'Units/' + id);
    }

    /**
     * Get logs of DictionariesSubValues.
     */
    getDictionaryUnitsLogs(id: number, criterias?: DictionaryUnitsFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryUnit[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryUnit[]>>>>(
            environment.API.URL + 'Units/Logs/' + id, { params: buildQueryParams(criterias) }
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
    submit(action: string, payload: DictionaryUnit) {
        const endpoint = environment.API.URL + 'Units';
        if (action === 'Create') return this.http.post(endpoint, payload);
        if (action === 'Edit') return this.http.put(endpoint, payload);
    }
}
