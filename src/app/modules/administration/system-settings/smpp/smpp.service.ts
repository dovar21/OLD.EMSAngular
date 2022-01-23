import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import BaseResponseInterface from 'src/app/modules/common/interfaces/base-response.interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

export interface Item {
    createdUserName?: string;
    createdAt?: string;
    id?: number;
    providerName: string;
    hostName: string;
    portNumber: number;
    userName: string;
    password: string;
    systemType: string;
    sourceAddressTon: number;
    sourceAddressNpi: number;
    sourceAddressAutodetect: boolean;
    destAddressTon: number;
    destAddressNpi: number;
    interfaceVersion: string;
    deliveryUserAckRequest: string;
    intermediateNotification: boolean;
    dataEncoding: string;
    validityPeriod: number;
    transceiverMode: number;
    receivePort: number;
    enquireLinkInterval: number;
    waitAckExpire: number;
    maxPendingSubmits: number;
    throughput: number;
    isDefault: boolean;
    isActive: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class SmppService {
    controllerEndpoint = environment.API.URL + 'SMPPSettings/';

    constructor(private http: HttpClient) { }

    /**
     * Get all SMPP configs.
     */
    getSMPPSettings(): Observable<BaseResponseInterface<Item[]>> {
        return this.http.get<BaseResponseInterface<Item[]>>(this.controllerEndpoint);
    }

    /**
     * Create or edit SMPP config.
     * @param action Action type (Create || Edit).
     * @param payload Newly created SMPP
     */
    submit(action: string, payload: Item): Observable<BaseResponseInterface<Item>> {
        if (action === 'Create') return this.http.post<BaseResponseInterface<Item>>(this.controllerEndpoint, payload);

        if (action === 'Edit') return this.http.put<BaseResponseInterface<Item>>(this.controllerEndpoint, payload);
    }
}
