import { Component, Inject, OnInit, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { CounterpartyCreate } from 'src/app/modules/counterparty/counterparty.service';

@Component({
    selector: 'app-dialog-lightbox',
    templateUrl: './dialog-lightbox.component.html',
    styleUrls: ['./dialog-lightbox.component.sass']
})
export class DialogLightboxComponent implements OnInit, OnChanges {

    // -------------------------------------------------------------------------
    // Input and Outputs
    // ------------------------------------------------------------------------
    /**
     * Emits when image saved
     */
    // @Output() imageSaved = new EventEmitter<any>();

    @Output() submitChanges = new EventEmitter<any>();
    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Values for request.
     */
    payload: any;

    /**
    * Uploaded image by input
    */
    uploadedImage: FileList;

    /**
   * Shown cropping True || False
   */
    croppingMode: boolean;

    /**
     * Image select
     */
    imagePreview: any;

    /**
    * Is image ready for saving
    */
    isImageReady: boolean;

    /**
   * Is image ready for saving
   */
    isRequesting: boolean;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        // private service: CounterpartyService,
        private snackbar: MatSnackBar
    ) { }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        console.log(changes);
    }

    ngOnInit() {
        this.imagePreview = this.data.photoPathMax;
    }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
    * Renders selected image to given img tag and assigns it to respective
    * form field
    * @param files Files object
    */
    uploadFile(files: FileList) {
        if (!files || (files && !files[0])) return;

        const fileReader = new FileReader();
        fileReader.readAsDataURL(files[0]);
        fileReader.onload = (e) => {
            const target: any = e.target;
            this.uploadedImage = target.result;
            this.croppingMode = true;
        }
    }

    onSubmitCrop(image: string) {
        if (image) {
            this.imagePreview = image;
            this.isImageReady = true;
        }
        this.croppingMode = false;
    }

    submit() {
        this.payload = {
            imageFile: this.imagePreview,
            id: this.data.id
        }

        this.submitChanges.emit(this.payload);
        this.isRequesting = true;

        // setTimeout(() => {
        //     this.isRequesting = false;
        //     this.isImageReady = false;
        //     this.snackbar.open('Фотография успешно изменено');
        // }, 4000);


        // this.service.submitCounterparty(this.payload)
        //     .subscribe(
        //         respone => {
        //             this.imagePreview = respone.data.imagePathSmall
        //             this.snackbar.open('Фотография успешно изменено');
        //             this.isImageReady = false;
        //             this.imageSaved.emit();
        //         },
        //         (error: any) => {
        //             this.isRequesting = false;
        //             this.snackbar.open('Что-то пошло не так ошибка:', error.code);
        //         },
        //         () => {
        //             this.isRequesting = false;
        //         }
        //     );
    }
}
