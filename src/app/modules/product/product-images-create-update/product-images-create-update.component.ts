import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { VALIDATION_ERRORS } from 'src/app/modules/common/lexicon/ru/validation-dictionary';
import { ProductImages, ProductImagesCreate, ProductService } from '../product.service';
import { ImageUploaderComponent } from '../../common/image-uploader/image-uploader.component';
import { componentDestroyed } from '../../common/utils';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'product-images-create-update',
    templateUrl: './product-images-create-update.component.html',
    styleUrls: ['./product-images-create-update.component.sass']
})
export class ProductImagesCreateUpdateComponent implements OnInit, OnDestroy {

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Department form.
     */
    form: FormGroup;

    /**
     * Page heading.
     */
    title: string = 'Добавление изображение';

    /**
     * ProductImage properties from Edit.
     */
    productImage: ProductImages;

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Form values for request.
     */
    payload: ProductImagesCreate;

    /**
     * Handling image before upload
     */
    imageUploader = ImageUploaderComponent;

    /**
     * An object with all validation errors.
     */
    validationErrors = VALIDATION_ERRORS;

    /**
     * Shown cropping True || False
     */
    croppingMode: boolean;

    /**
     * Image select
     */
    preview: string;

    // -------------------------------------------------------------------------
    // Private properties
    // -------------------------------------------------------------------------

    /**
     * product id
     */
    private productId: number;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(@Inject(MAT_DIALOG_DATA)
                public data: any,
                private dialogRef: MatDialogRef<ProductImagesCreateUpdateComponent>,
                private service: ProductService,
                private snackbar: MatSnackBar,
                private route: ActivatedRoute,
                private fb: FormBuilder
    ) {
        this.productId = this.data.productId;
        this.form = this.fb.group({
            image: ['', Validators.required],
            isPrimary: [{ value: true, disabled: this.data.isPrimary}],
            isVisibleOnSite: [true]
        });
    }

    ngOnInit() {
        if (this.data.id)
            this.title = 'Редактировние изображение';

        this.productImage = this.data;
        this.form.patchValue(this.data);
    }

    ngOnDestroy() { }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    onSubmitCrop(image: string) {
        this.form.patchValue({ image });
        this.productImage.image = image;
        this.croppingMode = false;
    }

    /**
     * Renders selected image to given img tag and assigns it to respective
     * form field
     * @param fileInput Files object
     */
    uploadFile(fileInput: HTMLInputElement): void {
        if (!fileInput.files || (fileInput.files && !fileInput.files[0]))
            return;

        const fileReader = new FileReader();
        fileReader.readAsDataURL(fileInput.files[0]);
        fileReader.onload = (e) => {
            const target: any = e.target;
            this.preview = target.result;
            this.croppingMode = true;
        };

        const formData = new FormData();
        formData.append("file", fileInput.files[0], fileInput.files[0].name);
    }

    /**
     * Handle redirection logic after form submit.
     */
    submit() {
        // // Mark form controls as touched to trigger validation visibility
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            this.snackbar.open('В форме содержатся ошибки');
            return false;
        }
        this.payload = {
            id: this.productImage.id,
            isPrimary: this.form.get('isPrimary').value,
            isVisibleOnSite: this.form.get('isVisibleOnSite').value
        };
        let action = 'Create';

        if (!this.productImage.id) this.payload.image = this.productImage.image;

        if (this.data.id) {
            action = 'Edit';
            this.payload.id = this.data.id;
        }

        this.isRequesting = true;
        this.form.disable();

        this.service
            .addOrUpdateProductImage(action, this.payload, this.productId)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.dialogRef.close(response.data);
                },
                error => {
                    this.isRequesting = false;
                    this.form.enable();
                    // if (error.status === 400) {
                    //     error.error.errors.forEach(error => {
                    //         if (error.code === 1005) this.form.get('name').setErrors({ duplicateTitle: true });
                    //     });
                    // }
                },
                () => {
                    this.isRequesting = false;
                    this.form.enable();
                }
            );
    }
}
