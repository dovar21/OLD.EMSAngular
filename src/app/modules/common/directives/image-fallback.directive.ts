import { Directive, Input, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: 'img[src]:not([excludeFallback])',
    host: {
        '[src]': 'checkPath(src)',
        '(error)': 'onError()',
        '(load)': 'onLoad(src)'
    }
})
export class ImageFallbackDirective implements OnInit {
    /**
     * Original image path.
     */
    @Input() src: string;

    /**
     * Fallback image path.
     */
    @Input('src-fallback') srcFallback: string = '../../../assets/img/image-placeholder.svg';

    /**
     * Referance to img DOM element from Angular.
     */
    private nativeElement: HTMLElement;

    /**
     * Determines whether original image is fully loadded
     * and ready to be inserted to DOM.
     */
    private isOriginalImageLoaded: boolean;

    /**
     * Referance to loading animation img while original
     * image is being loaded.
     */
    private animationRef: Animation;

    constructor(private element: ElementRef) {}

    ngOnInit() {
        this.nativeElement = this.element.nativeElement;
        this.startLoadingAnimation();
    }

    /**
     * Start loading animation.
     */
    private startLoadingAnimation() {
        this.animationRef = this.nativeElement.animate(
            [
                { opacity: 1 },
                { opacity: 0.8 },
                { opacity: 0.6 },
                { opacity: 0.4 },
                { opacity: 0.6 },
                { opacity: 0.8 },
                { opacity: 1 }
            ],
            {
                duration: 1500,
                iterations: Infinity
            }
        );
    }

    /**
     * Fires when image could not be loaded, e.g. error
     * 404, 500, etc.
     */
    public onError() {
        this.src = this.srcFallback;
    }

    /**
     * Fires when original image has been fully loaded
     * and is ready to be inserted to DOM.
     * @param src Original image path.
     */
    public onLoad(src: string) {
        this.isOriginalImageLoaded = true;
        if (this.nativeElement.getAttribute('src') === src) {
            this.animationRef.cancel();
        }
    }

    /**
     * Inserts original image or fallback one depending on whether
     * the original has been loaded or not.
     * @param src Original image path.
     */
    public checkPath(src: string) {
        return this.isOriginalImageLoaded ? src : this.srcFallback;
    }
}
