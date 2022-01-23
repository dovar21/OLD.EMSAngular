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
export interface DictionaryNewsCategoriesFetchCriterias {
    id?: number;
    name?: string;
    isActive?: boolean;
    onlyActive?: boolean;
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDir?: string;
}

export interface DictionaryNewsCategory {
    id?: number;
    name: string;
    rootId?: number;
    isActive?: boolean;
    lastModifiedAuthor?: string;
    lastModifiedAt?: string;
    author?: string;
    createdAt?: string;
}

export interface DictionaryNewsCategoryAutocomplete {
    id: number;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class DictionaryNewsCategoriesService {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private http: HttpClient) { }

    // -------------------------------------------------------------------------
    // Get methods
    // -------------------------------------------------------------------------

    /**
     * Get newsCategories list.
     * @param criterias Fetch criterias
     */
    getList(criterias?: DictionaryNewsCategoriesFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryNewsCategory[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryNewsCategory[]>>>>(
            environment.API.URL + 'NewsCategories', { params: buildQueryParams(criterias) }
        );
    }
    /**
     * Get total list of given dictionary items.
     */
    getNewsCategoriesSelectListItems(): Observable<BaseResponseInterface<DictionaryNewsCategoryAutocomplete[]>> {
        return this.http.get<BaseResponseInterface<DictionaryNewsCategoryAutocomplete[]>>(environment.API.URL + 'NewsCategories/SelectListItems');
    }

    /**
     *
     * @param id
     */
    getDictionaryNewsCategoriesById(id?: number): Observable<BaseResponseInterface<DictionaryNewsCategory>> {
        return this.http.get<BaseResponseInterface<DictionaryNewsCategory>>(environment.API.URL + 'NewsCategories/' + id);
    }

    /**
     * Get logs of DictionariesSubValues.
     */
    getDictionaryNewsCategoriesLogs(id: number, criterias?: DictionaryNewsCategoriesFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryNewsCategory[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryNewsCategory[]>>>>(
            environment.API.URL + 'NewsCategories/Logs/' + id, { params: buildQueryParams(criterias) }
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
    submit(action: string, payload: DictionaryNewsCategory) {
        const endpoint = environment.API.URL + 'NewsCategories';
        if (action === 'Create') return this.http.post(endpoint, payload);
        if (action === 'Edit') return this.http.put(endpoint, payload);
    }
}
