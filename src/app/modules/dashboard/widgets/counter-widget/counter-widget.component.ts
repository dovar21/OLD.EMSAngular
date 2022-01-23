import { Component, OnInit, Input } from '@angular/core';

export interface Data {
    title: string;
    subtitle: string;
    count: string;
    buttonLabel: string;
    link: string;
    queryParams?: string;
    icon: {
        value: string;
        size: string;
        right: string;
        bottom: string;
    };
}

@Component({
    selector: 'counter-widget',
    templateUrl: './counter-widget.component.html',
    styleUrls: ['./counter-widget.component.sass']
})
export class CounterWidgetComponent implements OnInit {
    /**
     * Data to be populated.
     */
    @Input() data: Data;

    constructor() {}

    ngOnInit() {}
}
