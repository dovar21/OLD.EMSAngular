import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/modules/authentication/auth.service';

/**
 * Shape of the user data from JWT token
 */
export default interface User {
    id: number;
    photo: string;
    name: string;
    position: string;
}

@Injectable({
    providedIn: 'root'
})
export class MiniProfileService {
    constructor(private authService: AuthService) {}

    /**
     * Get current signed-in user info from JWT
     */
    getUser(): User {
        const token = this.authService.getToken();
        const jwtHelper = new JwtHelperService();
        const { name, photo, position, id } = jwtHelper.decodeToken(token);

        const user = { name, photo, position, id };

        return user;
    }
}
