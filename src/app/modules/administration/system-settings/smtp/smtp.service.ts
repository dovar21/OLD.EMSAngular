import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import BaseResponseInterface from 'src/app/modules/common/interfaces/base-response.interface';
import { environment } from 'src/environments/environment';

export interface Item {
    id?: number;
    mailServerName: string;
    mailServer: string;
    mailPort: number;
    senderName: string;
    sender: string;
    password: string;
    isDefault: boolean;
    createdAt?: string;
    isActive: boolean;
    ssl: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class SmtpService {
    /**
     * Path to the API controller endpoint
     */
    private controllerEndpoint = environment.API.URL + 'EmailSettings/';

    constructor(private http: HttpClient) { }

    /**
     * Get all SMTP configs.
     */
    getEmailSettings(): Observable<BaseResponseInterface<Item[]>> {
        return this.http.get<BaseResponseInterface<Item[]>>(this.controllerEndpoint);
    }

    /**
     * Create or edit SMTP config.
     * @param action Action type (Create || Edit).
     * @param payload Newly created SMTP
     */
    submit(action: string, payload: Item): Observable<BaseResponseInterface<Item>> {
        if (action === 'Create') return this.http.post<BaseResponseInterface<Item>>(this.controllerEndpoint, payload);
        if (action === 'Edit') return this.http.put<BaseResponseInterface<Item>>(this.controllerEndpoint, payload);
    }

    /**
     * Delete config.
     * @param id Config ID.
     */
    delete(id: number): Observable<BaseResponseInterface<any>> {
        return this.http.delete<BaseResponseInterface<any>>(this.controllerEndpoint + id);
    }
}
