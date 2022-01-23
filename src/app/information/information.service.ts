import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import BaseResponseInterface from '../modules/common/interfaces/base-response.interface';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import PaginationItems from '../modules/common/interfaces/pagination-items.interface';
import { buildQueryParams } from '../modules/common/utils';
import { User } from '../modules/common/components/mini-profile/mini-profile.service';
import { DictionaryNewsCategory } from '../modules/dictionary/dictionary-news-categories/dictionary-news-categories.service';

export interface NewsArticle {
    description: string;
    shortDescription?: string;
    newsCategoryId?: number;
    newsCategoryName?: string;
    imagePath?: string;
    publishAt?: string;
}

export interface UsefulLink {
    usefulLinkCategoryId?: number;
    usefulLinkCategoryName?: string;
    url?: string;
}

export interface FileArchiveItem {
    file?: File;
    fileCategoryId?: number;
    fileCategoryName?: string;
    fileName?: string;
    filePath?: string;
}

export interface Item extends NewsArticle, UsefulLink, FileArchiveItem {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    isActive: boolean;
    author: User;
}

export interface FetchCriterias {
    title?: string;
    onlyActive?: boolean;
    fromDate?: string;
    toDate?: string;
    page?: number;
    pageSize?: number;
    categoryId?: number;
    sortProperty?: string;
    sortDir?: string;
}

export interface CategoryItemWithContent {
    id: number;
    name: string;
    itemsCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class NewsAndInfoService {
    constructor(private http: HttpClient) { }

    /**
     * Get passed entities list.
     * @param controllerName Name of the entity.
     * @param criterias filter properties.
     */
    getList(controllerName: string, criterias?: FetchCriterias): Observable<BaseResponseInterface<PaginationItems<Item[]>>> {
        if(controllerName === 'File') controllerName = controllerName + 's';
        return this.http.get<BaseResponseInterface<PaginationItems<Item[]>>>(
            environment.API.URL + controllerName, { params: buildQueryParams(criterias) }
        );
    }

    /**
     * Get single entity by id.
     * @param controllerName Name of the entity.
     * @param id ID og the entity.
     */
    getById(controllerName: string, id: number): Observable<BaseResponseInterface<Item>> {
        return this.http.get<BaseResponseInterface<Item>>(environment.API.URL + controllerName + '/' + id);
    }


    /**
     * Get categories.
     */
    getCategories(controllerName: string): Observable<BaseResponseInterface<DictionaryNewsCategory[]>> {
        return this.http.get<BaseResponseInterface<DictionaryNewsCategory[]>>(
            environment.API.URL + controllerName + '/SelectListItems'
        );
    }

    /**
     * Get categories only containing something.
     */
    getCategoriesWithContent(controllerName: string): Observable<BaseResponseInterface<CategoryItemWithContent[]>> {
        console.log('controllerName', controllerName);
        return this.http.get<BaseResponseInterface<CategoryItemWithContent[]>>(
            environment.API.URL + controllerName + '/SelectListItemsWithContent'
        );
    }

    /**
     * Create or edit article.
     * @param action Create or edit article.
     * @param payload Request payload.
     * @param controllerName name controller.
     */
    submit(action: string, controllerName: string, payload: FormData | UsefulLink) {
        const endpoint = environment.API.URL + controllerName;
        if (action === 'Create') return this.http.post<BaseResponseInterface<NewsArticle>>(endpoint, payload);
        if (action === 'Edit') return this.http.put<BaseResponseInterface<NewsArticle>>(endpoint, payload);
    }
}
