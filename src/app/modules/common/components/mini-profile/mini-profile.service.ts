import { Injectable } from '@angular/core';

export interface User {
    fullName: string;
    photoPath: string;
    employeeId: number;
    positionName: string;
}

@Injectable({
    providedIn: 'root'
})
export class MiniProfileService {}
