import { Component, OnInit, Input, HostListener } from '@angular/core';
import { fade } from 'src/app/animations/all';

@Component({
    selector: 'scroll-to-top',
    templateUrl: './scroll-to-top.component.html',
    styleUrls: ['./scroll-to-top.component.sass'],
    animations: [fade]
})
export class ScrollToTopComponent implements OnInit {
    /**
     * Offset from window bottom.
     */
    @Input() bottom: string;

    /**
     * Tooltip text.
     */
    @Input() title = 'Наверх';

    /**
     * Determines if the button is visible.
     */
    isVisible: boolean = false;

    constructor() {}

    ngOnInit() {}

    @HostListener('window:scroll', [])
    toggleVisibility() {
        if (window.scrollY > 1000) this.isVisible = true;
        else this.isVisible = false;
    }

    scrollToTop() {
        window.scrollTo(0, 0);
    }
}
