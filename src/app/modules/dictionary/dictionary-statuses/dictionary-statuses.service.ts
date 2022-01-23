import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import BaseResponseInterface from "../../common/interfaces/base-response.interface";
import { MatTableDataSource } from "@angular/material";
import { buildQueryParams } from "../../common/utils";
import PaginationItems from "../../common/interfaces/pagination-items.interface";

/**
 * The shape of fetch criterias for DB searching
 */
export interface DictionaryStatusesFetchCriterias {
    id?: number;
    name?: string;
    isActive?: boolean;
    onlyActive?: boolean;
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDir?: string;
}

export interface DictionaryStatus {
    id?: number;
    name: string;
    rootId?: number;
    isActive?: boolean;
    lastModifiedAuthor?: string;
    lastModifiedAt?: string;
    author?: string;
    createdAt?: string;
}

export interface DictionaryStatusAutocomplete {
    id: number;
    name: string;
}

@Injectable({ providedIn: "root" })
export class DictionaryStatusesService {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private http: HttpClient) {}

    // -------------------------------------------------------------------------
    // Get methods
    // -------------------------------------------------------------------------

    /**
     * Get dictionary-status list.
     * @param criterias Fetch criterias
     */
    getList(
        criterias?: DictionaryStatusesFetchCriterias
    ): Observable<
        BaseResponseInterface<
            PaginationItems<MatTableDataSource<DictionaryStatus[]>>
        >
    > {
        return this.http.get<
            BaseResponseInterface<
                PaginationItems<MatTableDataSource<DictionaryStatus[]>>
            >
        >(environment.API.URL + "Statuses", {
            params: buildQueryParams(criterias)
        });
    }

    /**
     *
     * @param id
     */
    getDictionaryStatusById(
        id?: number
    ): Observable<BaseResponseInterface<DictionaryStatus>> {
        return this.http.get<BaseResponseInterface<DictionaryStatus>>(
            environment.API.URL + "Statuses/" + id
        );
    }

    /**
     * Get total list of given dictionary items.
     */
    getDictionaryStatusesSelectListItems(): Observable<
        BaseResponseInterface<DictionaryStatusAutocomplete[]>
    > {
        // return this.http.get<BaseResponseInterface<DictionaryStatusAutocomplete[]>>(environment.API.URL + 'Statuses/SelectListItems');

        const statuses = [
            {
                id: 1,
                name: "В пути"
            },
            {
                id: 2,
                name: "Ожидает отгрузки"
            },
            {
                id: 3,
                name: "Принято"
            }
        ];

        return of(statuses).pipe(
            map(response => {
                const data: any = response;
                const errors: any = [];
                return { data, errors };
            })
        );
    }

    /**
     * Get logs of DictionariesSubValues.
     */
    getDictionaryStatusesLogs(
        id: number,
        criterias?: DictionaryStatusesFetchCriterias
    ): Observable<
        BaseResponseInterface<
            PaginationItems<MatTableDataSource<DictionaryStatus[]>>
        >
    > {
        return this.http.get<
            BaseResponseInterface<
                PaginationItems<MatTableDataSource<DictionaryStatus[]>>
            >
        >(environment.API.URL + "Statuses/Logs/" + id, {
            params: buildQueryParams(criterias)
        });
    }

    // -------------------------------------------------------------------------
    // Create or Update methods
    // -------------------------------------------------------------------------

    /**
     *
     * @param action The type of job to do (Create | Edit)
     * @param payload Form value
     */
    submit(action: string, payload: DictionaryStatus) {
        const endpoint = environment.API.URL + "Statuses";
        if (action === "Create") return this.http.post(endpoint, payload);
        if (action === "Edit") return this.http.put(endpoint, payload);
    }
}
