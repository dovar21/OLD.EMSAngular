import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingFabComponent } from './floating-fab/floating-fab.component';
import { TableBadgeComponent } from './table-badge/table-badge.component';
import { AlertComponent } from './alert/alert.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogLightboxComponent } from './dialog-lightbox/dialog-lightbox.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { MiniProfileComponent } from './mini-profile/mini-profile.component';
import { GetHostPipe } from '../pipes/get-host.pipe';
import { ToggleListComponent } from './toggle-list/toggle-list.component';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { ImageFallbackDirective } from '../directives/image-fallback.directive';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { ConfirmModalDialogComponent } from './confirm-modal/confirm-modal-dialog.component';
import { HighchartsPieComponent } from './highcharts/highcharts-pie/highcharts-pie.component';
import { HighchartsAreaComponent } from './highcharts/highcharts-area/highcharts-area.component';
import { HighchartsLineComponent } from './highcharts/highcharts-line/highcharts-line.component';
import { CropperImageModule } from '../cropper-image/cropper-image.module';

const components = [
    FloatingFabComponent,
    TableBadgeComponent,
    AlertComponent,
    DialogLightboxComponent,
    RightSidebarComponent,
    MiniProfileComponent,
    GetHostPipe,
    ToggleListComponent,
    InfiniteScrollComponent,
    ScrollToTopComponent,
    ImageFallbackDirective,
    ConfirmModalComponent,
    ConfirmModalDialogComponent,
    HighchartsPieComponent,
    HighchartsAreaComponent,
    HighchartsLineComponent
];

@NgModule({
    declarations: components,
    imports: [
        CommonModule,
        AppRoutingModule,
        MaterialModule,
        CropperImageModule
    ],
    exports: components,
    entryComponents: [
        DialogLightboxComponent,
        ConfirmModalComponent,
        ConfirmModalDialogComponent
    ]
})
export class CommonComponentsModule {}
