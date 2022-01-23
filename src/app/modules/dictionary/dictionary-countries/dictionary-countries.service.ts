import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from 'src/environments/environment';
import BaseResponseInterface from '../../common/interfaces/base-response.interface';
import {MatTableDataSource} from '@angular/material';
import { buildQueryParams } from '../../common/utils';
import PaginationItems from '../../common/interfaces/pagination-items.interface';
import {map} from 'rxjs/operators';

/**
 * The shape of fetch criterias for DB searching
 */
export interface DictionaryCountriesFetchCriterias {
    id?: number;
    name?: string;
    isActive?: boolean;
    onlyActive?: boolean;
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDir?: string;
}

export interface DictionaryCountry {
    id?: number;
    name: string;
    rootId?: number;
    isActive?: boolean;
    lastModifiedAuthor?: string;
    lastModifiedAt?: string;
    author?: string;
    createdAt?: string;
}

export interface DictionaryCountryAutocomplete {
    id: number;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class DictionaryCountriesService {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private http: HttpClient) { }

    // -------------------------------------------------------------------------
    // Get methods
    // -------------------------------------------------------------------------

    /**
     * Get dictionary-countries list.
     * @param criterias Fetch criterias
     */
    getList(criterias?: DictionaryCountriesFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryCountry[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryCountry[]>>>>(
            environment.API.URL + 'Countries', { params: buildQueryParams(criterias) }
        );
    }

    /**
     * Get dictionary-countries for compose autocomplete.
     */
    getDictionaryCountrySelectItems(): Observable<BaseResponseInterface<DictionaryCountryAutocomplete[]>> {
        return this.http.get<BaseResponseInterface<DictionaryCountryAutocomplete[]>>(
            environment.API.URL + 'Countries/SelectListItems'
        );
    }

    /**
     * Get logs of DictionariesSubValues.
     */
    getDictionaryCountriesLogs(id: number, criterias?: DictionaryCountriesFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryCountry[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<DictionaryCountry[]>>>>(
            environment.API.URL + 'Countries/Logs/' + id, { params: buildQueryParams(criterias) }
        );
    }

    /**
     *
     * @param id
     */
    getDictionaryCountriesById(id?: number): Observable<BaseResponseInterface<DictionaryCountry>> {
        return this.http.get<BaseResponseInterface<DictionaryCountry>>(environment.API.URL + 'Countries/' + id);
    }

    // -------------------------------------------------------------------------
    // Create or Update methods
    // -------------------------------------------------------------------------

    /**
     *
     * @param action The type of job to do (Create | Edit)
     * @param payload Form value
     */
    submit(action: string, payload: DictionaryCountry) {
        const endpoint = environment.API.URL + 'Countries';
        if (action === 'Create') return this.http.post(endpoint, payload);
        if (action === 'Edit') return this.http.put(endpoint, payload);
    }
}
