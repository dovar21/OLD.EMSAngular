import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import BaseResponseInterface from 'src/app/modules/common/interfaces/base-response.interface';
import PaginationItems from 'src/app/modules/common/interfaces/pagination-items.interface';
import { environment } from 'src/environments/environment';
import { buildQueryParams } from 'src/app/modules/common/utils';
import { MatTableDataSource } from '@angular/material';

export interface Item {
    receiverUser: string;
    receiverEmail: string;
    emailSettingId: number;
    senderEmail: string;
    subject: string;
    message: string;
    createdAt: string;
}

export interface FetchCriterias {
    receiverName?: string;
    receiverEmail?: string;
    senderName?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDir?: string;
}


@Injectable({
    providedIn: 'root'
})
export class EmailService {
    constructor(private http: HttpClient) { }

    /**
     * Get passed entities list.
     * @param controllerName Name of the entity.
     * @param criterias filter properties.
     */
    getList(controllerName: string, criterias?: FetchCriterias):
        Observable<BaseResponseInterface<PaginationItems<MatTableDataSource<Item[]>>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<MatTableDataSource<Item[]>>>>(
            environment.API.URL + controllerName, { params: buildQueryParams(criterias) }
        );
    }
}
