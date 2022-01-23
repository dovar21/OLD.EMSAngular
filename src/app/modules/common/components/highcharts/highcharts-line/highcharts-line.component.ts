import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment-timezone';
import * as Highcharts from 'highcharts';
import { chart, Options } from 'highcharts';

@Component({
    selector: 'highcharts-line',
    templateUrl: './highcharts-line.component.html',
    styleUrls: ['./highcharts-line.component.sass'],
})
export class HighchartsLineComponent implements OnInit, OnDestroy {

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
    subtitle: string;

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    days: number[] = [];

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    private chart: Highcharts.ChartObject;

    // -------------------------------------------------------------------------
    // Lifecycle callbacks
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.days = this.recreateDayCountOfMonth();

        const options: Options = {
            chart: {
                type: 'line'
            },
            title: {
                text: this.title
            },
            subtitle: {
                text: this.subtitle
            },


            yAxis: { visible: false },



            plotOptions: {
                spline: {
                    marker: {
                        enable: false
                    }
                }
            },

            series: [
                {
                    name: 'Закрытые',
                    color: '#533DFE',
                    data: [
                        [0, 15],
                        [10, -50],
                        [20, -56.5],
                        [30, -46.5],
                        [40, -22.1],
                        [50, -2.5],
                        [60, -27.7],
                        [70, -55.7],
                        [80, -76.5]
                    ]
                },
                {
                    name: 'В процессе',
                    color: '#FECA3D',
                    data: [
                        [0, 32],
                        [10, -42],
                        [20, -76.3],
                        [30, -66.7],
                        [40, -42.3],
                        [50, -1.1],
                        [60, -11.9],
                        [70, -51.4],
                        [80, -79.9]
                    ]
                },
                {
                    name: 'Возврат',
                    color: '#EF3232',
                    data: [
                        [0, 22],
                        [10, -22],
                        [20, -36.3],
                        [30, -46.7],
                        [40, -92.3],
                        [50, -4.1],
                        [60, -21.9],
                        [70, -58.4],
                        [80, -59.9]
                    ]
                },
            ]

        };

        this.chart = chart(this.containerElement.nativeElement, options);
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    private recreateDayCountOfMonth(): number[] {
        const days = moment().day();
        let i = 1;
        const dayRange: number[] = [];
        while (i <= days) {
            dayRange.push(i);
            i++;
        }
        return dayRange;
    }
}
