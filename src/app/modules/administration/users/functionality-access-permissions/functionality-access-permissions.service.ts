import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import BaseResponseInterface from 'src/app/modules/common/interfaces/base-response.interface';
import { environment } from 'src/environments/environment';

/**
 * Shape of a singe permission.
 */
export interface Permission {
    name: string;
    description: string;
    selected: boolean;
    categoryName: string;
}

/**
 * Shape of the permission group.
 */
export interface PermissionGroup {
    groupName: string;
    roles: Permission[];
}

/**
 * Shape of the granted permissions to be sent to server
 */
export interface GrantedPermissions {
    userId: string;
    rolesName: string[];
}

@Injectable({
    providedIn: 'root'
})
export class FunctionalityAccessPermissionsService {
    constructor(private http: HttpClient) { }

    /**
     * Get all functionality access permisiions.
     * @param id User ID.
     */
    get(id: number): Observable<BaseResponseInterface<PermissionGroup[]>> {
        return this.http.get<BaseResponseInterface<PermissionGroup[]>>(
            environment.API.URL + 'Account/Roles/' + id
        );
    }

    /**
     * Set functionality access permisiions.
     * @param payload Payload consisting of User ID and an array of granted
     * permissions.
     */
    set(payload: GrantedPermissions): Observable<BaseResponseInterface<any>> {
        return this.http.post<BaseResponseInterface<any>>(
            environment.API.URL + '/Account/Roles',
            JSON.stringify(payload)
        );
    }
}
