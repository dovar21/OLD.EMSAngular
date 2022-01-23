import {
    Component,
    Input,
    OnDestroy,
    OnChanges,
    SimpleChanges
} from "@angular/core";
import { fade } from "src/app/animations/all";
import { Product, ProductImages, ProductService } from "../../product.service";
import { MatDialog, MatSnackBar } from '@angular/material';
import { takeUntil } from "rxjs/operators";
import { componentDestroyed } from "../../../common/utils";
import { ProductImagesCreateUpdateComponent } from "../../product-images-create-update/product-images-create-update.component";

@Component({
    selector: "product-images-card",
    templateUrl: "./product-images-card.component.html",
    styleUrls: ["./product-images-card.component.sass"],
    animations: [fade]
})
export class ProductImagesCardComponent implements OnChanges, OnDestroy {
    // -------------------------------------------------------------------------
    // Inputs / Outputs
    // -------------------------------------------------------------------------

    /**
     * Product which we look
     */
    @Input() product: Product;

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------
    /**
     * Selected image for edit
     */
    selectImageForEdit: ProductImages;

    /* Show or hide arrow buttons in gallery */
    isImageLengthMore: boolean;

    ///*** Images length */
    numberOfImages: number;

    //** Image Slider values */
    translate: number = 0;
    currentImage: number = 4;
    disableButton: boolean = false;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private productService: ProductService,
                private snackbar: MatSnackBar,
                private dialog: MatDialog) {
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnChanges(changes: SimpleChanges) {
        if (changes['product'] && changes['product'].currentValue) {
            if (this.product.images) {
                const isPrimaryImage = this.product.images.find(
                    image => image.isPrimary
                );
                if (isPrimaryImage) {
                    this.selectImageForEdit = isPrimaryImage;
                } else {
                    delete this.selectImageForEdit;
                }
            }
            this.numberOfImages = this.product.images.length;
        }
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     *  Peoduct gallery slider
     */
    prevImage() {
        if (this.translate) {
            this.translate += 90.25;
            this.currentImage--;
            this.disableButton = false;
        }
    }

    nextImage() {
        if (this.currentImage < this.numberOfImages) {
            this.translate += -90.25;
            this.currentImage++;
            if (this.currentImage === this.numberOfImages) {
                this.disableButton = true;
            }
        }
    }

    /**
     * Selected image for edit
     */
    selectImage(productImage: ProductImages) {
        this.selectImageForEdit = productImage;
    }

    /**
     * Update product images
     */
    openDialogUpdate(): void {
        const dialogRef = this.dialog.open(ProductImagesCreateUpdateComponent, {
            data: {
                productId: this.product.id,
                id: this.selectImageForEdit.id,
                image: this.selectImageForEdit.image,
                isPrimary: this.selectImageForEdit.isPrimary,
                isVisibleOnSite: this.selectImageForEdit.isVisibleOnSite
            }
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(result => {
                if (result) {
                    const oldImage = this.product.images.find(image => image.isPrimary);
                    oldImage.isPrimary = false;

                    const foundImage = this.product.images.find(image => image.id === result.id);
                    foundImage.image = result.image;
                    foundImage.isPrimary = result.isPrimary;
                    foundImage.isVisibleOnSite = result.isVisibleOnSite;
                }
            });
    }

    /**
     * Create product images
     */
    openDialogCreate(): void {
        const foundImageIsPrimary = this.product.images.find(
            image => image.isPrimary
        );
        const dialogRef = this.dialog.open(ProductImagesCreateUpdateComponent, {
            data: {
                productId: this.product.id,
                isPrimary: !foundImageIsPrimary
            }
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(result => {
                if (result && result.id) {
                    if (result.isPrimary === true) {
                        const oldImage = this.product.images.find(image => image.isPrimary);
                        if (oldImage) oldImage.isPrimary = false;
                        this.selectImageForEdit = result;
                    }
                    this.product.images.push(result);
                    this.numberOfImages++;
                    this.disableButton = false;
                }
            });
    }

    /**
     * Create product images
     */
    removeImage() {
        if (this.selectImageForEdit && !this.selectImageForEdit.isPrimary) {
            this.productService
                .deleteImage(this.selectImageForEdit.id)
                .pipe(takeUntil(componentDestroyed(this)))
                .subscribe(response => {
                    this.snackbar.open('Фото удалено.');
                    this.numberOfImages--;
                    const foundImage = this.product.images.find(image => image.id === this.selectImageForEdit.id);
                    this.product.images.splice(this.product.images.indexOf(foundImage), 1);
                    this.selectImageForEdit = this.product.images.find(image => image.isPrimary)
                },error => {
                    // if (error.status === 400) {
                    //     error.error.errors.forEach(error => {
                    //         if (error.code === 1005) this.form.get('name').setErrors({ duplicateTitle: true });
                    //     });
                    // }
                });
        } else if (this.selectImageForEdit && this.selectImageForEdit.isPrimary) {
            this.snackbar.open('Для того чтобы удалить это фото вам необходимо убрать из основного фото');
        }
    }
}
