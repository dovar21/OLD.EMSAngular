import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import BaseResponseInterface from '../../common/interfaces/base-response.interface';
import {MatTableDataSource} from '@angular/material';
import { buildQueryParams } from '../../common/utils';
import PaginationItems from '../../common/interfaces/pagination-items.interface';

/**
 * The shape of fetch criterias for DB searching
 */
export interface DictionaryPositionsFetchCriterias {
    id?: number;
    name?: string;
    isActive?: boolean;
    onlyActive?: boolean;
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDir?: string;
}

export interface DictionaryPositions {
    id?: number;
    name: string;
    rootId?: number;
    isActive?: boolean;
    lastModifiedAuthor?: string;
    lastModifiedAt?: string;
    author?: string;
    createdAt?: string;
    departmentId?: number;
}

export interface DictionaryPositionsAutocomplete {
    id: number;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class DictionaryPositionsService {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private http: HttpClient) { }

    // -------------------------------------------------------------------------
    // Get methods
    // -------------------------------------------------------------------------

    /**
     * Get dictionary-positions list.
     * @param criterias Fetch criterias
     */
    getList(criterias?: DictionaryPositionsFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryPositions[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryPositions[]>>>>(
            environment.API.URL + 'Positions', { params: buildQueryParams(criterias) }
        );
    }

    /**
     * Get dictionary-positions by department ID
     * @param departmentId Department ID
     */
    getDictionaryPositionsByDepartmentIdSelectListItems(departmentId: number): Observable<BaseResponseInterface<DictionaryPositionsAutocomplete[]>> {
        return this.http.get<BaseResponseInterface<DictionaryPositionsAutocomplete[]>>(environment.API.URL + 'Positions/SelectListItems/' + departmentId);
    }

    /**
     *
     * @param id
     */
    getDictionaryPositionsById(id?: number): Observable<BaseResponseInterface<DictionaryPositions>> {
        return this.http.get<BaseResponseInterface<DictionaryPositions>>(environment.API.URL + 'DictionaryPositions/' + id);
    }

    /**
     * Get logs of DictionariesSubValues.
     */
    getDictionaryPositionsLogs(id: number, criterias?: DictionaryPositionsFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryPositions[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryPositions[]>>>>(
            environment.API.URL + 'Positions/Logs/' + id, { params: buildQueryParams(criterias) }
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
    submit(action: string, payload: DictionaryPositions) {
        const endpoint = environment.API.URL + 'Positions';
        if (action === 'Create') return this.http.post(endpoint, payload);
        if (action === 'Edit') return this.http.put(endpoint, payload);
    }
}
