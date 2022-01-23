import { NgModule } from '@angular/core';
import { CropperImageComponent } from './cropper-image.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
    ],
    declarations: [
        CropperImageComponent
    ],
    exports: [
        CropperImageComponent
    ]
})
export class CropperImageModule {}
