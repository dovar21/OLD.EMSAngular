import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonComponentsModule } from '../common/components/common-components.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxMaskModule } from 'ngx-mask';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { ProductViewComponent } from './product-view/product-view-component';
import { ProductsPropertiesTabComponent } from './products-tabs/products-properties-tab/products-properties-tab.component';
import { ProductsResidueTabComponent } from './products-tabs/products-residue-tab/products-residue-tab.component';
import { ProductsAnalogTabComponent } from './products-tabs/products-analog-tab/products-analog-tab.component';
import { ProductsPromosTabComponent } from './products-tabs/products-promos-tab/products-promos-tab.component';
import { ProductImplementationCardComponent } from './product-card/product-implementation-card/product-implementation-card.component';
import { ProductPropertiesCardComponent } from './product-card/product-properties-card/product-properties-card.component';
import { ProductPreviewCardComponent } from './product-preview-card/product-preview-card.component';
import { ProductImagesCardComponent } from './product-card/product-images-card/product-images-card.component';
import { ProductDescriptionCardComponent } from './product-card/product-description-card/product-description-card.component';
import { ProductImagesCreateUpdateComponent } from './product-images-create-update/product-images-create-update.component';
import { ProductsInterestedEmployeesTabComponent } from './products-tabs/products-interested-employees-tab/products-interested-employees-tab.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductFilterListComponent } from './product-filter-list/product-filter-list.component';
import { CropperImageModule } from '../common/cropper-image/cropper-image.module';

@NgModule({
    declarations: [
        ProductListComponent,
        ProductCreateComponent,
        ProductFilterComponent,
        ProductFilterListComponent,
        ProductViewComponent,
        ProductImagesCreateUpdateComponent,
        ProductsPropertiesTabComponent,
        ProductImagesCardComponent,
        ProductPropertiesCardComponent,
        ProductImplementationCardComponent,
        ProductDescriptionCardComponent,
        ProductsResidueTabComponent,
        ProductsPromosTabComponent,
        ProductsInterestedEmployeesTabComponent,
        ProductPreviewCardComponent,
        ProductsAnalogTabComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        PerfectScrollbarModule,
        ReactiveFormsModule,
        CommonComponentsModule,
        CKEditorModule,
        NgxMaskModule.forRoot(),
        CropperImageModule
    ],
    entryComponents: [
        ProductFilterComponent,
        ProductCreateComponent,
        ProductImagesCreateUpdateComponent,
    ]
})
export class ProductModule {}
