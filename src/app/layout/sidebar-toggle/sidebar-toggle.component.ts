import { Component, Input } from '@angular/core';
import { SidenavStateService } from '../dashboard-layout/sidenav-state.service';

@Component({
    selector: 'sidebar-toggle',
    templateUrl: './sidebar-toggle.component.html',
    styleUrls: ['./sidebar-toggle.component.sass']
})
export class SidebarToggleComponent {
    @Input() theme: string;

    constructor(private sidenavState: SidenavStateService) {}

    toggleSidebar() {
        this.sidenavState.onSideNavToggle.emit();
    }
}
