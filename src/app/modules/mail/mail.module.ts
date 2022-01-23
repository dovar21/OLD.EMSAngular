import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../material/material.module';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonComponentsModule } from '../common/components/common-components.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MailComponent } from './mail.component';
import { MessagesComponent } from './messages/messages.component';
import { MessagePreviewCardComponent } from './messages/preview/preview.component';
import { MessageFullViewComponent } from './messages/full-view/full-view.component';
import { CreateComponent } from './send/send.component';
import { FilterComponent } from './filter/filter.component';

@NgModule({
    declarations: [
        MailComponent,
        MessagesComponent,
        MessagePreviewCardComponent,
        MessageFullViewComponent,
        CreateComponent,
        FilterComponent
    ],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        MaterialModule,
        RouterModule,
        PerfectScrollbarModule,
        ReactiveFormsModule,
        CommonComponentsModule,
        CKEditorModule
    ],
    entryComponents: [CreateComponent]
})
export class MessagesModule {}
