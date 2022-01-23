import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../common/components/mini-profile/mini-profile.service';
import { Observable } from 'rxjs';
import BaseResponseInterface from '../common/interfaces/base-response.interface';
import { environment } from 'src/environments/environment';
import PaginationItems from '../common/interfaces/pagination-items.interface';
import { buildQueryParams } from '../common/utils';

export interface Message {
    id: number;
    title: string;
    createdAt: string;
    user: User;
    senderUserId: number;
    receiverUserId: number;
    readDate: string;
    body?: string;
}

export interface FetchCriterias {
    title?: string;
    fromDate?: string;
    toDate?: string;
}

export interface AutocompleteUser {
    id: number;
    name: string;
}

export interface CreatedMessage {
    title: string;
    body: string;
    receiverUserId: number;
}

@Injectable({
    providedIn: 'root'
})
export class MailService {
    constructor(private http: HttpClient) { }

    /**
     * Get messages list for preview.
     * @param messagesType Type of the messages user wants to retrieve (inbox || sent).
     * @param pageNumber
     * @param fetchCriterias
     */
    getMessages(
        messagesType: string,
        pageNumber: number = 1,
        fetchCriterias?: FetchCriterias
    ): Observable<BaseResponseInterface<PaginationItems<Message[]>>> {
        let actionName = 'Received';

        if (messagesType === 'sent') actionName = 'Sent';

        return this.http.get<BaseResponseInterface<PaginationItems<Message[]>>>(
            `${environment.API.URL}Messages/${actionName}?page=${pageNumber}&`, { params: buildQueryParams(fetchCriterias) }
        );
    }

    /**
     * Get concreete message by ID.
     * @param id Message ID.
     * @param messagesType Message type (inbox || sent).
     */
    getMessage(id: number, messagesType: string): Observable<BaseResponseInterface<Message>> {
        let actionName = 'Received';

        if (messagesType === 'sent') actionName = 'Sent';

        return this.http.get<BaseResponseInterface<Message>>(`${environment.API.URL}Messages/${actionName}/${id}`);
    }

    /**
     * Get users for compose autocomplete.
     */
    getUsers(): Observable<BaseResponseInterface<AutocompleteUser[]>> {
        return this.http.get<BaseResponseInterface<AutocompleteUser[]>>(
            environment.API.URL + 'Account/UsersSelectListItems'
        );
    }

    /**
     * Send message.
     * @param payload Composed message data.
     */
    sendMessage(payload: CreatedMessage): Observable<BaseResponseInterface<Message>> {
        return this.http.post<BaseResponseInterface<Message>>(
            environment.API.URL + 'Messages',
            JSON.stringify(payload)
        );
    }
}
