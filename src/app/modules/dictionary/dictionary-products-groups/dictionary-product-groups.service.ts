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
export interface DictionaryProductGroupsFetchCriterias {
    id?: number;
    name?: string;
    isActive?: boolean;
    onlyActive?: boolean;
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDir?: string;
}

export interface DictionaryProductGroup {
    id?: number;
    name: string;
    rootId?: number;
    isActive?: boolean;
    lastModifiedAuthor?: string;
    lastModifiedAt?: string;
    author?: string;
    createdAt?: string;
}

export interface DictionaryProductGroupsAutocomplete {
    id: number;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class DictionaryProductGroupsService {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private http: HttpClient) { }

    // -------------------------------------------------------------------------
    // Get methods
    // -------------------------------------------------------------------------

    /**
     * Get productGroups list.
     * @param criterias Fetch criterias
     */
    getList(criterias?: DictionaryProductGroupsFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryProductGroup[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryProductGroup[]>>>>(
            environment.API.URL + 'ProductGroups', { params: buildQueryParams(criterias) }
        );
    }

    /**
     * Get total list of given dictionary items.
     */
    getDictionaryProductGroupsSelectListItems(): Observable<BaseResponseInterface<DictionaryProductGroupsAutocomplete[]>> {
        return this.http.get<BaseResponseInterface<DictionaryProductGroupsAutocomplete[]>>(
            environment.API.URL + 'ProductGroups/SelectListItems');
    }

    /**
     *
     * @param id
     */
    getDictionaryProductGroupsById(id?: number): Observable<BaseResponseInterface<DictionaryProductGroup>> {
        return this.http.get<BaseResponseInterface<DictionaryProductGroup>>(environment.API.URL + 'ProductGroups/' + id);
    }

    /**
     * Get logs of DictionariesSubValues.
     */
    getDictionaryProductGroupsLogs(id: number, criterias?: DictionaryProductGroupsFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryProductGroup[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryProductGroup[]>>>>(
            environment.API.URL + 'ProductGroups/Logs/' + id, { params: buildQueryParams(criterias) }
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
    submit(action: string, payload: DictionaryProductGroup) {
        const endpoint = environment.API.URL + 'ProductGroups';
        if (action === 'Create') return this.http.post(endpoint, payload);
        if (action === 'Edit') return this.http.put(endpoint, payload);
    }
}
