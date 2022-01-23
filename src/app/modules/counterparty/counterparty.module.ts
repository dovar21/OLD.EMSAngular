import { MatTableModule } from '@angular/material/table';
import { CounterpartyWaybillsFilterListComponent } from './counterparty-tab/counterparty-waybills-tab/counterparty-waybills-filter-list/counterparty-waybills-filter-list.component';
import { CounterpartyWaybillsFilterComponent } from './counterparty-tab/counterparty-waybills-tab/counterparty-waybills-filter/counterparty-waybills-filter.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonComponentsModule } from '../common/components/common-components.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxMaskModule } from 'ngx-mask';
import { CounterpartyListComponent } from './counterparty-list/counterparty-list.component';
import { CounterpartyPreviewCardComponent } from './counterparty-preview-card/counterparty-preview-card.component';
import { CounterpartyPropertiesTabComponent } from './counterparty-tab/counterparty-properties-tab/counterparty-properties-tab.component';
import { CounterpartyCreateComponent } from './counterparty-create/counterparty-create.component';
import { CounterpartyViewComponent } from './counterparty-view/counterparty-view-component';
import { CounterpartyPropertiesCardComponent } from './counterparty-card/counterparty-properties-card/counterparty-properties-card.component';
import { CounterpartyLastWaybillsCardComponent } from './counterparty-card/counterparty-last-waybills-card/counterparty-last-waybills-card.component';
import { CounterpartyContactsTabComponent } from './counterparty-tab/counterparty-contacts-tab/counterparty-contacts-tab.component';
import { CounterpartyContactCreateUpdateComponent } from './counterparty-contact-create-update/counterparty-contact-create-update.component';
import { CounterpartyContactViewComponent } from './counterparty-contact-view/counterparty-contact-view.component';
import { CounterpartyOfficesTabComponent } from './counterparty-tab/counterparty-offices-tab/counterparty-offices-tab.component';
import { CounterpartyOfficeCreateUpdateComponent } from './counterparty-office-create-update/counterparty-office-create-update.component';
import { CounterpartyOfficeViewComponent } from './counterparty-office-view/counterparty-office-view.component';
import { CounterpartyFilterComponent } from './counterparty-filter/counterparty-filter.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { YandexMapsViewComponent } from '../common/components/yandex-maps/yandex-maps-view.component';
import { CounterpartyFilterListComponent } from './counterparty-filter-list/counterparty-filter-list.component';
import { CounterpartyWaybillsTabComponent } from './counterparty-tab/counterparty-waybills-tab/counterparty-waybills-tab.component';
import { CropperImageModule } from '../common/cropper-image/cropper-image.module';

@NgModule({
    declarations: [
        CounterpartyListComponent,
        CounterpartyFilterComponent,
        CounterpartyFilterListComponent,
        CounterpartyPreviewCardComponent,
        CounterpartyCreateComponent,
        CounterpartyViewComponent,
        CounterpartyPropertiesTabComponent,
        CounterpartyPropertiesCardComponent,
        CounterpartyContactsTabComponent,
        CounterpartyContactCreateUpdateComponent,
        CounterpartyContactViewComponent,
        CounterpartyOfficesTabComponent,
        CounterpartyOfficeCreateUpdateComponent,
        CounterpartyOfficeViewComponent,
        CounterpartyLastWaybillsCardComponent,
        YandexMapsViewComponent,
        CounterpartyWaybillsTabComponent,
        CounterpartyWaybillsFilterComponent,
        CounterpartyWaybillsFilterListComponent
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
        MatBottomSheetModule,
        MatTableModule,
        CropperImageModule
    ],
    entryComponents: [
        CounterpartyFilterComponent,
        CounterpartyCreateComponent,
        CounterpartyContactCreateUpdateComponent,
        CounterpartyContactViewComponent,
        CounterpartyOfficeCreateUpdateComponent,
        CounterpartyOfficeViewComponent,
        CounterpartyWaybillsFilterComponent
    ]
})
export class CounterpartyModule {}
