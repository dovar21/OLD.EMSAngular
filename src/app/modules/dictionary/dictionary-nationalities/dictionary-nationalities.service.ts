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
export interface DictionaryNationalitiesFetchCriterias {
    id?: number;
    name?: string;
    isActive?: boolean;
    onlyActive?: boolean;
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDir?: string;
}

export interface DictionaryNationality {
    id?: number;
    name: string;
    rootId?: number;
    isActive?: boolean;
    lastModifiedAuthor?: string;
    lastModifiedAt?: string;
    author?: string;
    createdAt?: string;
}

export interface DictionaryNationalityAutocomplete {
    id: number;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class DictionaryNationalitiesService {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private http: HttpClient) { }

    // -------------------------------------------------------------------------
    // Get methods
    // -------------------------------------------------------------------------

    /**
     * Get dictionary-nationalities list.
     * @param criterias Fetch criterias
     */
    getList(criterias?: DictionaryNationalitiesFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryNationality[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryNationality[]>>>>(
            environment.API.URL + 'Nationalities', { params: buildQueryParams(criterias) }
        );
    }

    /**
     * Get total list of given dictionary items.
     */
    getDictionaryNationalitiesSelectListItems(): Observable<BaseResponseInterface<DictionaryNationalityAutocomplete[]>> {
        return this.http.get<BaseResponseInterface<DictionaryNationalityAutocomplete[]>>(environment.API.URL + 'Nationalities/SelectListItems');
    }

    /**
     *
     * @param id
     */
    getDictionaryNationalitiesById(id?: number): Observable<BaseResponseInterface<DictionaryNationality>> {
        return this.http.get<BaseResponseInterface<DictionaryNationality>>(environment.API.URL + 'Nationalities/' + id);
    }

    /**
     * Get logs of DictionariesSubValues.
     */
    getDictionaryNationalitiesLogs(id: number, criterias?: DictionaryNationalitiesFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryNationality[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryNationality[]>>>>(
            environment.API.URL + 'Nationalities/Logs/' + id, { params: buildQueryParams(criterias) }
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
    submit(action: string, payload: DictionaryNationality) {
        const endpoint = environment.API.URL + 'Nationalities';
        if (action === 'Create') return this.http.post(endpoint, payload);
        if (action === 'Edit') return this.http.put(endpoint, payload);
    }
}
