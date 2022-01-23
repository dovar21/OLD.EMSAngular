import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { chart, Options } from 'highcharts';

@Component({
    selector: 'highcharts-pie',
    templateUrl: './highcharts-pie.component.html',
    styleUrls: ['./highcharts-pie.component.sass'],
})
export class HighchartsPieComponent implements OnInit, OnDestroy {

    // -------------------------------------------------------------------------
    // ViewChild
    // -------------------------------------------------------------------------

    @ViewChild('container', { static: true })
    containerElement: ElementRef;

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    /**
     * Set title charts.
     */
    @Input()
    title: string;

    /**
     * Set title charts.
     */
    @Input()
    description: string;

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    private chart: Highcharts.ChartObject;

    // -------------------------------------------------------------------------
    // Lifecycle callbacks
    // -------------------------------------------------------------------------

    ngOnInit() {
        const options: Options = {
            chart: {
                type: 'pie',
                // margin: [0, 0, 0, 0],
                // spacingTop: 0,
                // spacingBottom: 0,
                // spacingLeft: 0,
                // spacingRight: 0
            },
            title: {
                // загаловок таблицы
                text: this.title
            },
            subtitle: {
                // описание таблицы
                text: this.description
            },
            plotOptions: {
                pie: {
                    // ширина круга
                    innerSize: 100,
                    // скрывать детали
                    dataLabels: {
                        enabled: false
                    },
                }
            },
            // tooltip
            series: [{
                name: 'Delivered amount',
                data: [
                    ['Bananas', 8],
                    ['Kiwi', 3],
                    ['Mixed nuts', 1],
                    ['Oranges', 6],
                    ['Apples', 8],
                    ['Pears', 4],
                    ['Clementines', 4],
                    ['Reddish (bag)', 1],
                    ['Grapes (bunch)', 1]
                ]
            }]
        };

        this.chart = chart(this.containerElement.nativeElement, options);
    }

    ngOnDestroy() {}
}
