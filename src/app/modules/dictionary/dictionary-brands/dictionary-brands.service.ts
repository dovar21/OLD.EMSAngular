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
export interface DictionaryBrandsFetchCriterias {
    id?: number;
    name?: string;
    isActive?: boolean;
    onlyActive?: boolean;
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDir?: string;
}

export interface DictionaryBrand {
    id?: number;
    name: string;
    rootId?: number;
    isActive?: boolean;
    lastModifiedAuthor?: string;
    lastModifiedAt?: string;
    author?: string;
    createdAt?: string;
}

export interface DictionaryBrandAutocomplete {
    id: number;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class DictionaryBrandsService {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private http: HttpClient) { }

    // -------------------------------------------------------------------------
    // Get methods
    // -------------------------------------------------------------------------

    /**
     * Get dictionary-brands list.
     * @param criterias Fetch criterias
     */
    getList(criterias?: DictionaryBrandsFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryBrand[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryBrand[]>>>>(
        environment.API.URL + 'Brands', { params: buildQueryParams(criterias) }
        );
    }

    /**
     *
     * @param id
     */
    getDictionaryBrandById(id?: number): Observable<BaseResponseInterface<DictionaryBrand>> {
        return this.http.get<BaseResponseInterface<DictionaryBrand>>(environment.API.URL + 'Brands/' + id);
    }

    /**
     * Get total list of given dictionary items.
     */
    getDictionaryBrandsSelectListItems(): Observable<BaseResponseInterface<DictionaryBrandAutocomplete[]>> {
        return this.http.get<BaseResponseInterface<DictionaryBrandAutocomplete[]>>(environment.API.URL + 'Brands/SelectListItems');
    }

    /**
     * Get logs of DictionariesSubValues.
     */
    getDictionaryBrandsLogs(id: number, criterias?: DictionaryBrandsFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryBrand[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryBrand[]>>>>(
            environment.API.URL + 'Brands/Logs/' + id, { params: buildQueryParams(criterias) }
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
    submit(action: string, payload: DictionaryBrand) {
        const endpoint = environment.API.URL + 'Brands';
        if (action === 'Create') return this.http.post(endpoint, payload);
        if (action === 'Edit') return this.http.put(endpoint, payload);
    }
}
