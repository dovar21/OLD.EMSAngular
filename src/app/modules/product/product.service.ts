import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import BaseResponseInterface from '../common/interfaces/base-response.interface';
import PaginationItems from '../common/interfaces/pagination-items.interface';
import { map } from 'rxjs/operators';
import { buildQueryParams } from '../common/utils';
import { environment } from '../../../environments/environment';

/**
 * The shape of fetch criterias for DB searching
 */
export interface ProductFetchCriterias {
    title?: string;
    productGroupId?: number;
    brandId?: number;
    isActive?: boolean;
    onlyActive?: boolean;
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDir?: string;
}

/**
 * The shape of fetch criterias for DB searching
 */
export interface ProductAnalogsFetchCriterias {
    sortProperty?: string;
    sortDir?: string;
}

export interface Product {
    id: number;
    title: string;
    image?: string;
    shortDescription: string;
    images: ProductImages[];
    productGroup: string;
    countryOfOrigin: string;
    brand: string;
    unit: string;
    tare: string;
    quantityPerTare: number;
    barcode: number;
    warehouseMinQuantity: number;
    retailPrice: number;
    wholesalePrice: number;
    minWholesaleSellQuantity: number;
    ignoreDiscounts: boolean;
    isAvailableInShops: boolean;
    isAvailableForWholesale: boolean;
    isVisibleOnSite: boolean;
    description: string;
}

export interface ProductCreate {
    id?: number;
    title?: string;
    productGroupId?: number;
    unitId?: number;
    tareId?: number;
    quantityPerTare?: number;
    countryOfOriginId?: number;
    brandId?: number;
    ignoreDiscounts?: boolean;
    isAvailableInShops?: boolean;
    isAvailableForWholesale?: boolean;
    isVisibleOnSite?: boolean;
    barcode?: number;
    warehouseMinQuantity?: number;
    retailPrice?: number;
    wholesalePrice?: number;
    minWholesaleSellQuantity?: number;
    description?: string;
    shortDescription?: string;
}

export interface ProductImages {
    id?: number;
    image: string;
    isPrimary: boolean;
    isVisibleOnSite: boolean;
}

export interface ProductImagesCreate {
    id?: number;
    image?: string;
    isPrimary: boolean;
    isVisibleOnSite: boolean;
}

export interface Remains {
    total: number;
    perRegion: PerRegion[];
}

export interface PerRegion {
    region: string;
    total: number;
    perWarehouse: PerWarehouse[];
}

export interface PerWarehouse {
    title: string;
    amount: number;
}

export interface ProductAnalogs {
    id: number;
    title: string;
    shortDescription: string;
    countryOfOrigin: string;
    wholesalePrice: number;
    retailPrice: number;
    image: string;
}

export interface ProductAnalogsCreate {
    analogId: number;
}

export interface Promo {
    name: string;
    discountAmount: string;
    startDate: string;
    endDate: string;
    isWholesaleSale: boolean;
    isRetailSale: boolean;
}

export interface ProductInterestedEmployee {
    id: number;
    photo: string;
    fullName: string;
    department: string;
    notifyByEmail: boolean;
    notifyBySMS: boolean;
}

export interface ProductInterestedEmployeeCreate {
    employeeId: number;
    notifyByEmail?: boolean;
    notifyBySMS?: boolean;
}

export interface AutocompleteAnalog {
    id: number;
    imageSmall: string;
    title: string;
    shortDescription: string;
    countryOfOrigin: string;
    wholesalePrice: number;
    retailPrice: number;
    image: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private http: HttpClient) {}

    // -------------------------------------------------------------------------
    // Get methods
    // -------------------------------------------------------------------------

    /**
     * Get dictionary-departments list.
     * @param criterias Fetch criterias
     */
    getList(criterias?: ProductFetchCriterias): Observable<BaseResponseInterface<PaginationItems<Product[]>>> {
        return this.http.get<BaseResponseInterface<PaginationItems<Product[]>>>(
            environment.API.URL + 'Products', { params: buildQueryParams(criterias) }
        );
    }

    /**
     *
     * @param id
     */
    getProductById(id: number): Observable<BaseResponseInterface<Product>> {
        return this.http.get<BaseResponseInterface<Product>>(environment.API.URL + 'Products/' + id);
    }

    /**
     * Get all ProductAnalogs by product ID
     */
    getProductImagesEntries(id: number): Observable<BaseResponseInterface<ProductImages[]>> {
        const productImages = [
            // TODO: Mock
            {
                id: 5,
                image: '5',
                isPrimary: false,
                isVisibleOnSite: true
            }
        ];

        return of(productImages).pipe(
            map(response => {
                const data: any = response;
                const errors: any = [];
                return { data, errors };
            })
        );
        // return this.http.get<BaseResponseInterface<ProductAnalogs[]>>(environment.API.URL + 'Products/ProductAnalogs/' + id);
    }

    /**
     * Get all Remains by product ID.
     */
    getProductRemains(id: number): Observable<BaseResponseInterface<Remains>> {
        const remains = {
            total: '12447',
            perRegions: [
                {
                    region: 'ГБАО',
                    total: '2345',
                    perWarehouse: [
                        {
                            title: '№2352',
                            amount: '452'
                        },
                        {
                            title: '№3453',
                            amount: '453'
                        },
                        {
                            title: '№4353',
                            amount: '546'
                        },
                        {
                            title: '№5463',
                            amount: '123'
                        }
                    ]
                },
                {
                    region: 'РПП',
                    total: '3433',
                    perWarehouse: [
                        {
                            title: '№12',
                            amount: '1432'
                        },
                        {
                            title: '№534',
                            amount: '533'
                        },
                        {
                            title: '№34',
                            amount: '1453'
                        },
                        {
                            title: '№511234',
                            amount: '2359'
                        }
                    ]
                },
                {
                    region: 'Согд',
                    total: '1435',
                    perWarehouse: [
                        {
                            title: '№2369',
                            amount: '866'
                        },
                        {
                            title: '№912',
                            amount: '465'
                        },
                        {
                            title: '№112',
                            amount: '365'
                        },
                        {
                            title: '№761',
                            amount: '927'
                        }
                    ]
                },
                {
                    region: 'Хатлон',
                    total: '381',
                    perWarehouse: [
                        {
                            title: '№996',
                            amount: '32'
                        },
                        {
                            title: '№614',
                            amount: '1650'
                        },
                        {
                            title: '№213',
                            amount: '569'
                        },
                        {
                            title: '№733',
                            amount: '622'
                        }
                    ]
                }
            ]
        }; // TODO: Mock

        return of(remains).pipe(
            map(response => {
                const data: any = { total: response.total, perRegions: response.perRegions };
                const errors: any = [];
                return { data, errors };
            })
        );

        // return this.http.get<BaseResponseInterface<Product[]>>(environment.API.URL + 'Products/Remains/' + id);
    }

    /**
     * Get all analogs by product ID
     */
    getProductAnalogsEntries(id: number, criterias?: ProductAnalogsFetchCriterias): Observable<BaseResponseInterface<ProductAnalogs[]>> {
        return this.http.get<BaseResponseInterface<ProductAnalogs[]>>(environment.API.URL + 'Products/' + id + '/Analogs', { params: buildQueryParams(criterias) });
    }

    /**
     * Get all Stocks by product ID
     */
    getProductStocksEntries(id: number): Observable<BaseResponseInterface<Promo[]>> {
        const stocks = [
            // TODO: Mock
            {
                name: 'Распродажа сумки',
                discountAmount: '2 (~5%)',
                startDate: '20.09.2019',
                endDate: '23.10.2019',
                isWholesaleSale: false,
                isRetailSale: true
            },
            {
                name: 'Распродажа "Навруз>>',
                discountAmount: '3 (~5.6%)',
                startDate: '18.03.2018',
                endDate: '25.03.2018',
                isWholesaleSale: true,
                isRetailSale: true
            }
        ];
        return of(stocks).pipe(
            map(response => {
                const data: any = response;
                const errors: any = [];
                return { data, errors };
            })
        );
        // return this.http.get<BaseResponseInterface<Promo[]>>(environment.API.URL + 'Promos/' + id);
    }

    /**
     * Get all InterestedEmployees by product ID
     * @param productId
     */
    getProductInterestedEmployeesByProductId(productId: number): Observable<BaseResponseInterface<ProductInterestedEmployee[]>> {
        return this.http.get<BaseResponseInterface<ProductInterestedEmployee[]>>(environment.API.URL + 'Products/' + productId + '/InterestedEmployees');
    }

    /**
     * Get products for compose autocomplete.
     */
    getProductAnalogsAutocomplete(): Observable<BaseResponseInterface<AutocompleteAnalog[]>> {
        return this.http.get<BaseResponseInterface<AutocompleteAnalog[]>>(environment.API.URL + 'Products/AutocompleteItems');
    }

    // -------------------------------------------------------------------------
    // Post/Put methods
    // -------------------------------------------------------------------------

    /**
     * Create new Product
     * @param payload Form value
     */
    submit(payload: ProductCreate): Observable<BaseResponseInterface<Product>> {
        return this.http.post<BaseResponseInterface<Product>>(environment.API.URL + 'Products', payload);
    }

    /**
     * Update Product
     * @param product from update
     */
    submitProductGroup(product: ProductCreate): Observable<BaseResponseInterface<Product>> {
        return this.http.put<BaseResponseInterface<Product>>(environment.API.URL + 'Products', product);
    }

    /**
     * Change InterestedEmployees
     * @param productId from update
     * @param payload Form value
     */
    submitInterestedEmployees(productId: number, payload: ProductInterestedEmployeeCreate) {
        return this.http.put(environment.API.URL + 'Products/' + productId + '/InterestedEmployees', payload);
    }


    /**
     * Add InterestedEmployees in Product
     * @param productId from update
     * @param payload Form value
     */
    addEmployee(productId: number, payload: ProductInterestedEmployeeCreate) {
        return this.http.post(environment.API.URL + '/Products/' + productId + '/InterestedEmployees', payload);
    }

    /**
     * Add new AdministrationEmployee in Product
     */
    addProductAnalog(productId: number, payload: ProductAnalogsCreate): Observable<BaseResponseInterface<ProductAnalogs>> {
        return this.http.post<BaseResponseInterface<ProductAnalogs>>(environment.API.URL + 'Products/' + productId + '/Analogs', payload);
    }

    /**
     * Add new Image in Product
     */
    addOrUpdateProductImage(action: string, payload: ProductImagesCreate, productId: number): Observable<BaseResponseInterface<ProductImages>> {
        const endpoint = environment.API.URL + 'Products/' + productId + '/Images';
        if (action === 'Create') return this.http.post<BaseResponseInterface<ProductImages>>(endpoint, payload);
        if (action === 'Edit') return this.http.put<BaseResponseInterface<ProductImages>>(endpoint, payload);
    }

    // -------------------------------------------------------------------------
    // Remove methods
    // -------------------------------------------------------------------------

    /**
     * Delete image in product images.
     * @param productId.
     * @param id image ID.
     */
    deleteImage(id: number): Observable<BaseResponseInterface<any>> {
        return this.http.delete<BaseResponseInterface<any>>(environment.API.URL + 'Products/Images/' + id);
    }

    /**
     * Untie analog of product by ID
     * @param productId.
     * @param analogId.
     */
    getUntieAnalogsByProductId(productId: number, analogId: number) {
        return this.http.delete(environment.API.URL + 'Products/' + productId  + '/Analogs/' + analogId);
    }

    /**
     * Untie InterestedEmployees from Product
     */
    untieInterestedEmployees(productId: number,employeeId: number) {
        return this.http.delete(environment.API.URL + 'Products/' + productId + '/InterestedEmployees/' + employeeId);
    }
}
