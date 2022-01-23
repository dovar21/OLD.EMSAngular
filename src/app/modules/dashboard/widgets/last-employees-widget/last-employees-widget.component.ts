import { Component, OnInit, Input } from '@angular/core';
import { AdministrationEmployee } from 'src/app/modules/administration/administration-employee/administration-employee.service';

@Component({
    selector: 'last-employees-widget',
    templateUrl: './last-employees-widget.component.html',
    styleUrls: ['./last-employees-widget.component.sass']
})
export class LastEmployeesWidgetComponent implements OnInit {
    /**
     * Data to be populated.
     */
    @Input() data: AdministrationEmployee[];

    constructor() {}

    ngOnInit() {}
}
