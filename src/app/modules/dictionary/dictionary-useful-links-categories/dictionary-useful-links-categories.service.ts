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
export interface DictionaryUsefulLinksCategoriesFetchCriterias {
    id?: number;
    name?: string;
    isActive?: boolean;
    onlyActive?: boolean;
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDir?: string;
}

export interface DictionaryUsefulLinksCategory {
    id?: number;
    name: string;
    rootId?: number;
    isActive?: boolean;
    lastModifiedAuthor?: string;
    lastModifiedAt?: string;
    author?: string;
    createdAt?: string;
}

export interface AutocompleteDictionaryUsefulLinksCategory {
    id: number;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class DictionaryUsefulLinksCategoriesService {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private http: HttpClient) { }

    // -------------------------------------------------------------------------
    // Get methods
    // -------------------------------------------------------------------------

    /**
     * Get UsefulLinkCategories list.
     * @param criterias Fetch criterias
     */
    getList(criterias?: DictionaryUsefulLinksCategoriesFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryUsefulLinksCategory[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryUsefulLinksCategory[]>>>>(
            environment.API.URL + 'UsefulLinkCategories', { params: buildQueryParams(criterias) }
        );
    }

    /**
     * Get total list of given dictionary items.
     */
    getDictionaryUsefulLinksCategoriesSelectListItems(): Observable<BaseResponseInterface<AutocompleteDictionaryUsefulLinksCategory[]>> {
        return this.http.get<BaseResponseInterface<AutocompleteDictionaryUsefulLinksCategory[]>>(environment.API.URL + 'UsefulLinkCategories/SelectListItems');
    }

    /**
     *
     * @param id
     */
    getDictionaryUsefulLinksCategoriesById(id?: number): Observable<BaseResponseInterface<DictionaryUsefulLinksCategory>> {
        return this.http.get<BaseResponseInterface<DictionaryUsefulLinksCategory>>(environment.API.URL + 'UsefulLinkCategories/' + id);
    }

    /**
     * Get logs of DictionariesSubValues.
     */
    getDictionaryUsefulLinksCategoriesLogs(id: number, criterias?: DictionaryUsefulLinksCategoriesFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryUsefulLinksCategory[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryUsefulLinksCategory[]>>>>(
            environment.API.URL + 'UsefulLinkCategories/Logs/' + id, { params: buildQueryParams(criterias) }
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
    submit(action: string, payload: DictionaryUsefulLinksCategory) {
        const endpoint = environment.API.URL + 'UsefulLinkCategories';
        if (action === 'Create') return this.http.post(endpoint, payload);
        if (action === 'Edit') return this.http.put(endpoint, payload);
    }
}
