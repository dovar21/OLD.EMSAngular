import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import BaseResponseInterface from "../common/interfaces/base-response.interface";
import PaginationItems from "../common/interfaces/pagination-items.interface";
import { map } from "rxjs/operators";
import { buildQueryParams } from '../common/utils';
import { environment } from '../../../environments/environment';

/**
 * The shape of fetch criterias for DB searching
 */
export interface CounterpartyFetchCriterias {
    page?: number;
    pageSize?: number;
    name?: string;
    isBuyer?: boolean;
    isSupplier?: boolean;
    countryId?: number;
    itn?: string;
}

export interface Counterparty {
    id: number;
    name: string;
    countryId: number;
    countryName: string;
    website: string;
    description: string;
    isSupplier: boolean;
    isBuyer: boolean;
    balance: string;
    currencyName: string;
    imagePath: string;
    imagePathSmall: string;
    legalName: string;
    officesCount: string;
    itn: string;
    waybills: any[];
    headOffice: CounterpartOffices
}

export interface CounterpartyCreate {
    id?: number;
    name?: string;
    countryId?: number;
    website?: string;
    description?: string;
    imageFile?: string;
    legalName?: string;
    itn?: string;
    isSupplier?: boolean;
    isBuyer?: boolean;
}

export interface CounterpartyImage {
    image?: string;
}

export interface CounterpartWaybillCreate {
    id: number;
    createdAt?: string;
    typeName?: string;
    typeId?: number;
    totalSum?: string;
    currencyName?: string;
}

export interface CounterpartyWaybill {
    id: number;
    createdAt: string;
    typeName: string;
    typeId: number;
    totalSum: string;
    currencyName: string;
}

export interface CounterpartyContact {
    id: number;
    fullName: string;
    countryId: number;
    countryName: string;
    positionName: string;
    contacts: string;
    description: string;
    photoPath: string;
    photoPathSmall: string; // 200px * 200px
}

export interface CounterpartContactCreate {
    id?: number;
    fullName?: string;
    countryId?: number;
    countryName?: string;
    positionName?: string;
    contacts?: string;
    description?: string;
    photo?: string;
}

export interface CounterpartOffices {
    id: number;
    countryId: number;
    countryName: string;
    address: string;
    contacts: string;
    description: string;
    isPrimary: boolean;
}

export interface CounterpartyOfficeCreate {
    id?: number;
    countryId: number;
    address: string;
    contacts: string;
    description: string;
    isPrimary: boolean;
}

export interface CounterpartyWaybills {
    id: number;
    typeName: string;
    number: number;
    date: string;
    productsCount: number;
    totalSum: number;
    currencyName: string;
    statusName: string;
    createdBy: string;
    balance: string;
}

export interface CounterpartyWaybillsFetchCriteries {
    page?: number;
    pageSize?: number;
    dateFrom?: string;
    dateTo?: string;
    statusId?: number;
    tabs?: string;
    sortDir?: string;
    sortProperty?: string;
}

@Injectable({ providedIn: "root" })
export class CounterpartyService {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private http: HttpClient) {}

    // -------------------------------------------------------------------------
    // Get methods
    // -------------------------------------------------------------------------

    /**
     * Get сounterparties list.
     * @param criterias Fetch criterias
     */
    getList(criterias?: CounterpartyFetchCriterias): Observable<BaseResponseInterface<PaginationItems<Counterparty[]>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<Counterparty[]>>>(
            environment.API.URL + 'Counterparties', { params: buildQueryParams(criterias) }
        );
    }

    /**
     *
     * @param id
     */
    getCounterpartyById(id: number): Observable<BaseResponseInterface<Counterparty>> {
        return this.http.get<BaseResponseInterface<Counterparty>>(environment.API.URL + 'Counterparties/' + id);
    }

    /**
     * Get all Waybill by counterpart ID
     */

    getCounterpartyWaybillsList(
        id: number,
        criteries?: CounterpartyFetchCriterias
    ): Observable<BaseResponseInterface<CounterpartyWaybills[]>> {
        return of({
            errors: null,
            data: [
            {
                id: 1,
                typeName: "Отгрузка со склада",
                number: 1234,
                date: "24.08.2019, 12:23",
                productsCount: 2343,
                totalSum: 43000,
                currencyName: "TJS",
                statusName: "В пути",
                createdBy: "Расулов Азмат Олимович",
                balance: "33434"
            },

            {
                id: 2,
                typeName: "Приход на склад",
                number: 4334,
                date: "26.05.2013, 15:23",
                productsCount: 543,
                totalSum: 45000,
                currencyName: "RUB",
                statusName: "Принято",
                createdBy: "Златан Ибрагим Ибрагимович",
                balance: "23434"
            },

            {
                id: 3,
                typeName: "Возврат",
                number: 4334,
                date: "26.05.2015, 13:23",
                productsCount: 234,
                totalSum: 56534,
                currencyName: "EUR",
                statusName: "Возврат",
                createdBy: "Раджабов Алексей Махмадназарович",
                balance: "987654"
            }
        ]
    }
        )
    }

    /**
     * Get all Contacts by counterpart ID
     */
    getCounterpartyContacts(id: number): Observable<BaseResponseInterface<CounterpartyContact[]>> {
        return this.http.get<BaseResponseInterface<CounterpartyContact[]>>(environment.API.URL + 'Counterparties/' + id + '/Contacts');
    }

    /**
     * Get all Offices by counterpart ID
     */
    getCounterpartyOffices(id: number): Observable<BaseResponseInterface<CounterpartOffices[]>> {
        return this.http.get<BaseResponseInterface<CounterpartOffices[]>>(environment.API.URL + 'Counterparties/' + id + '/Offices');
    }

    // -------------------------------------------------------------------------
    // Post/Put methods
    // -------------------------------------------------------------------------

    /**
     *
     * @param payload Form value
     */
    submit(payload: CounterpartyCreate): Observable<BaseResponseInterface<Counterparty>> {
        return this.http.post<BaseResponseInterface<Counterparty>>(environment.API.URL + 'Counterparties', payload);
    }

    /**
     *
     * @param counterparty from update
     */
    submitCounterparty(counterparty: CounterpartyCreate): Observable<BaseResponseInterface<Counterparty>> {
        return this.http.put<BaseResponseInterface<Counterparty>>(environment.API.URL + 'Counterparties', counterparty);
    }

    /**
     * @param payload from update
     * @param counterpartyId
     */
    submitCreateCounterpartyContact(counterpartyId: number, payload: CounterpartContactCreate) {
        return this.http.post(environment.API.URL + '/Counterparties/' + counterpartyId + '/Contacts', payload);
    }

    /**
     * @param payload from update
     * @param counterpartyId
     */
    submitUpdateCounterpartyContact(counterpartyId: number, payload: CounterpartContactCreate) {
        return this.http.put(environment.API.URL + '/Counterparties/' + counterpartyId + '/Contacts', payload);
    }

    /**
     * Untie CounterpartContact from Counterparty
     * @param contactId
     */
    untieContact(contactId: number) {
        return this.http.delete(environment.API.URL + 'Counterparties/Contacts/' + contactId);
    }

    /**
     *
     * @param payload from update
     * @param counterpartyId by url
     */
    suubmitCreateOffice(counterpartyId: number, payload: CounterpartyOfficeCreate): Observable<BaseResponseInterface<CounterpartOffices>> {
        return this.http.post<BaseResponseInterface<CounterpartOffices>>(
            environment.API.URL + '/Counterparties/' + counterpartyId + '/Offices', payload
        );
    }

    /**
     *
     * @param payload from update
     * @param counterpartyId by url
     */
    suubmitUpdateOffice(counterpartyId: number, payload: CounterpartyOfficeCreate): Observable<BaseResponseInterface<CounterpartOffices>> {
        return this.http.put<BaseResponseInterface<CounterpartOffices>>(
            environment.API.URL + '/Counterparties/' + counterpartyId + '/Offices', payload
        );
    }

    /**
     * Untie CounterpartOffice from Counterparty
     */
    untieOffice(counterpartOfficeId: number) {
        return this.http.delete(environment.API.URL + 'Counterparties/Offices/' + counterpartOfficeId);
    }

    /**
     *
     * @param payload Form value
     */
    submitWaybills(payload: CounterpartWaybillCreate) {
        const data = { id: 1 };
        return of(data).pipe(
            map(response => {
                return true;
            })
        );
        // return this.http.post(environment.API.URL + 'Counterparties/Contacts', payload);
    }

    /**
     * Untie InterestedEmployees from Product
     */
    untieWaybills(payload: CounterpartWaybillCreate) {
        // TODO: Mock
        return of(true).pipe(
            map(response => {
                const data: any = { items: response };
                const meta: any = {
                    success: true,
                    statusCode: 200,
                    errors: []
                };
                return { data, meta };
            })
        );

        // return this.http.delete(environment.API.URL + 'Counterparties/Contacts/', payload);
    }
}
