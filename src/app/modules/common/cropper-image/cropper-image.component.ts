import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import Cropper from 'cropperjs';

@Component({
    selector: 'cropper-image',
    templateUrl: './cropper-image.component.html',
    styleUrls: ['./cropper-image.component.sass'],
})
export class CropperImageComponent implements AfterViewInit {

    // -------------------------------------------------------------------------
    // ViewChild
    // -------------------------------------------------------------------------

    @ViewChild('image', { static: false })
    imageElement: ElementRef;

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    /**
     * Image for src
     */
    @Input('src')
    imageSource: string;

    /**
     * True || False
     */
    @Input()
    isAvatar: boolean;

    /**
     * An event that emits on cropperMode (True | False)
     */
    @Output()
    onSubmitCrop = new EventEmitter<string>();

    // -------------------------------------------------------------------------
    // Private properties
    // -------------------------------------------------------------------------

    private cropper: Cropper;

    // -------------------------------------------------------------------------
    // Lifecycle callbacks
    // -------------------------------------------------------------------------

    ngAfterViewInit() {
        this.cropper = new Cropper(this.imageElement.nativeElement, {
            viewMode: 1,
            aspectRatio: this.isAvatar === true ? 3 / 3 : 16 / 9,
            dragMode: "move" as any,
            checkCrossOrigin: false,
            toggleDragModeOnDblclick: false,
            cropBoxResizable: false,
            highlight: false,
        });
    }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * Accept crop properties and create image and properties
     */
    acceptCropImg() {
        const canvas = this.cropper.getCroppedCanvas();
        const image = canvas.toDataURL("image/jpg,image/jpeg");
        this.onSubmitCrop.emit(image);
        delete this.imageSource;
    }

    /**
     * Cancel crop and properties crop
     */
    cancelCropImg() {
        this.onSubmitCrop.emit();
    }

    /**
     * Rotate right image
     */
    rotateRight() {
        this.cropper.rotate(90);
    }

    /**
     * Rotate left image
     */
    rotateLeft() {
        this.cropper.rotate(-90);
    }

}
