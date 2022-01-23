import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef,
    HostListener
} from '@angular/core';

@Component({
    selector: 'infinite-scroll',
    templateUrl: './infinite-scroll.component.html',
    styleUrls: ['./infinite-scroll.component.sass']
})
export class InfiniteScrollComponent implements OnInit, OnDestroy {
    @Input() options = {};
    @Output() scrolled = new EventEmitter();
    @ViewChild('anchor', { static: true }) anchor: ElementRef<HTMLElement>;

    private observer: IntersectionObserver;
    private isScrolled: boolean;

    constructor(private host: ElementRef) {}

    get element() {
        return this.host.nativeElement;
    }

    ngOnInit() {
        const options = {
            root: this.isHostScrollable() ? this.host.nativeElement : null,
            rootMargin: '1000px',
            ...this.options
        };

        console.log(options);

        this.observer = new IntersectionObserver(([entry]) => {
            entry.isIntersecting && this.scrolled.emit();
        }, options);

        this.observe();
    }

    @HostListener('body:scroll', [])
    observe() {
        if (!this.isScrolled) {
            this.isScrolled = true;
            this.observer.observe(this.anchor.nativeElement);
        }
    }

    private isHostScrollable() {
        const style = window.getComputedStyle(this.element);

        return style.getPropertyValue('overflow') === 'auto' || style.getPropertyValue('overflow-y') === 'scroll';
    }

    ngOnDestroy() {
        this.observer.unobserve(this.anchor.nativeElement);
    }
}
