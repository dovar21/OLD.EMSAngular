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
export interface FileCategoriesFetchCriterias {
    id?: number;
    name?: string;
    isActive?: boolean;
    onlyActive?: boolean;
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDir?: string;
}

export interface FilesCategory {
    id?: number;
    name: string;
    rootId?: number;
    isActive?: boolean;
    lastModifiedAuthor?: string;
    lastModifiedAt?: string;
    author?: string;
    createdAt?: string;
}

export interface AutocompleteFilesCategory {
    id: number;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class DictionaryFileCategoriesService {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private http: HttpClient) { }

    // -------------------------------------------------------------------------
    // Get methods
    // -------------------------------------------------------------------------

    /**
     * Get filesCategories list.
     * @param criterias Fetch criterias
     */
    getList(criterias?: FileCategoriesFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<FilesCategory[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<FilesCategory[]>>>>(
            environment.API.URL + 'FileCategories', { params: buildQueryParams(criterias) }
        );
    }
    /**
     * Get total list of given dictionary items.
     */
    getFilesCategoriesSelectListItems(): Observable<BaseResponseInterface<AutocompleteFilesCategory[]>> {
        return this.http.get<BaseResponseInterface<AutocompleteFilesCategory[]>>(environment.API.URL + 'FileCategories/SelectListItems');
    }

    /**
     *
     * @param id
     */
    getFilesCategoriesById(id?: number): Observable<BaseResponseInterface<FilesCategory>> {
        return this.http.get<BaseResponseInterface<FilesCategory>>(environment.API.URL + 'FileCategories/' + id);
    }

    /**
     * Get logs of DictionariesSubValues.
     */
    getFilesCategoriesLogs(id: number, criterias?: FileCategoriesFetchCriterias): Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<FilesCategory[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<FilesCategory[]>>>>(
            environment.API.URL + 'FileCategories/Logs/' + id, { params: buildQueryParams(criterias) }
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
    submit(action: string, payload: FilesCategory) {
        const endpoint = environment.API.URL + 'FileCategories';
        if (action === 'Create') return this.http.post(endpoint, payload);
        if (action === 'Edit') return this.http.put(endpoint, payload);
    }
}
