import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonComponentsModule } from '../modules/common/components/common-components.module';
import { NewsAndUsefulLinksListComponent } from './list/list.component';
import { CreateUpdateNewsArticleComponent } from './create-update-news-article/create-update-news-article.component';
import { CreateUpdateUsefulLinkComponent } from './create-update-useful-link/create-update-useful-link.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NewsAndInfoFilterComponent } from './filter/filter.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ArticleCardComponent } from './article-card/article-card.component';
import { PostFullViewComponent } from './post-full-view/post-full-view.component';
import { CreateUpdateFileArchiveComponent } from './create-update-file-archive/create-update-file-archive.component';
import { NgxMaskModule } from 'ngx-mask';
import { CropperImageModule } from '../modules/common/cropper-image/cropper-image.module';

@NgModule({
    declarations: [
        NewsAndUsefulLinksListComponent,
        CreateUpdateNewsArticleComponent,
        CreateUpdateUsefulLinkComponent,
        NewsAndInfoFilterComponent,
        ArticleCardComponent,
        PostFullViewComponent,
        CreateUpdateFileArchiveComponent
    ],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        MaterialModule,
        RouterModule,
        PerfectScrollbarModule,
        ReactiveFormsModule,
        CommonComponentsModule,
        CKEditorModule,
        CropperImageModule,
        NgxMaskModule.forRoot()
    ],
    entryComponents: [CreateUpdateUsefulLinkComponent, CreateUpdateFileArchiveComponent]
})
export class NewsAndInfoModule {}
