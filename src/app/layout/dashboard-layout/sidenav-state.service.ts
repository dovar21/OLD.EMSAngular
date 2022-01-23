import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SidenavStateService {
    onSideNavToggle = new EventEmitter<boolean>();

    constructor() {}
}
