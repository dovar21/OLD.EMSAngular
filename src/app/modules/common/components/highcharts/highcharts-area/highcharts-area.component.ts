import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { chart, Options } from 'highcharts';

@Component({
    selector: 'highcharts-area',
    templateUrl: './highcharts-area.component.html',
    styleUrls: ['./highcharts-area.component.sass'],
})
export class HighchartsAreaComponent implements OnInit, OnDestroy {

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
     * Set color line.
     */
    @Input()
    color: string;

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
                type: 'area'
            },
            title: {
                text: this.title,
            },
            subtitle: {
                text: '1 023 TJS',
                align: 'top',
                verticalAlign: 'high'
            },
            // tooltip: {
            //     pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
            // },
            xAxis: { visible: false },
            yAxis: { visible: false },
            plotOptions: {
                area: {
                    pointStart: 1940,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            series: [{
                showInLegend: false,
                name: this.title,
                color: this.color,
                data: [
                    6, 11, 32, 110, 235,
                    369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468,
                    20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
                    26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
                    24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380,
                    21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
                    10577, 10527, 10475, 10421, 10358, 10295, 10104, 9914, 9620, 9326,
                    5113, 5113, 4954, 4804, 4761, 4717, 4368, 4018
                ]
            }]
        };

        this.chart = chart(this.containerElement.nativeElement, options);
    }

    ngOnDestroy() {}
}
