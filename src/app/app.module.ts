import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from '@angular/cdk/layout';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { BreadcrumbsComponent } from './layout/breadcrumbs/breadcrumbs.component';
import { MiniProfileComponent } from './layout/mini-profile/mini-profile.component';
import { NotificationWidgetComponent } from './layout/notification-widget/notification-widget.component';
import { MainNavigationComponent } from './layout/main-navigation/main-navigation.component';
import { SidenavStateService } from './layout/dashboard-layout/sidenav-state.service';
import { SidebarToggleComponent } from './layout/sidebar-toggle/sidebar-toggle.component';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatPaginatorIntl, MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { DEFAULT_PERFECT_SCROLLBAR_CONFIG, MAT_DIALOG_GLOBAL_OPTIONS, CUSTOM_MAT_DATE_FORMATS } from './app.config';
import { NewsAndInfoModule } from './information/information.module';
import { PushNotificationsModule } from 'ng-push';
import { BackButtonComponent } from './layout/back-button/back-button.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ImageUploaderComponent } from './modules/common/image-uploader/image-uploader.component';
import { CounterWidgetComponent } from './modules/dashboard/widgets/counter-widget/counter-widget.component';
import { LastNewsWidgetComponent } from './modules/dashboard/widgets/last-news-widget/last-news-widget.component';
import { LastEmployeesWidgetComponent } from './modules/dashboard/widgets/last-employees-widget/last-employees-widget.component';
import { AuthModule } from './modules/authentication/auth.module';
import { AdministrationModule } from './modules/administration/administration.module';
import { DictionaryModule } from './modules/dictionary/dictionary.module';
import { MessagesModule } from './modules/mail/mail.module';
import { CommonComponentsModule } from './modules/common/components/common-components.module';
import { CounterpartyModule } from './modules/counterparty/counterparty.module';
import { ProductModule } from './modules/product/product.module';
import { GlobalHttpHeadersInterceptorService } from './modules/common/services/http-interceptor.service';
import { MatPaginatorIntlRus } from './modules/common/paginator-translation';
import { MomentUtcDateAdapter } from './modules/common/MomentUtcDateAdapter';
import { AuthService } from './modules/authentication/auth.service';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        DashboardLayoutComponent,
        HeaderComponent,
        BreadcrumbsComponent,
        MiniProfileComponent,
        NotificationWidgetComponent,
        ImageUploaderComponent,
        MainNavigationComponent,
        SidebarToggleComponent,
        BackButtonComponent,
        CounterWidgetComponent,
        LastNewsWidgetComponent,
        LastEmployeesWidgetComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        LayoutModule,
        NgMaterialMultilevelMenuModule,
        PerfectScrollbarModule,
        AuthModule,
        AdministrationModule,
        DictionaryModule,
        NewsAndInfoModule,
        MessagesModule,
        PushNotificationsModule,
        CommonComponentsModule,
        CounterpartyModule,
        ProductModule
    ],
    entryComponents: [],
    providers: [
        //JwtInterceptor, // Providing JwtInterceptor allow to inject JwtInterceptor manually into RefreshTokenInterceptor
        // {
        //     provide: HTTP_INTERCEPTORS,
        //     useExisting: JwtInterceptor,
        //     multi: true
        // },
        { provide: HTTP_INTERCEPTORS, useClass: GlobalHttpHeadersInterceptorService, multi: true },
        { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: MAT_DIALOG_GLOBAL_OPTIONS },
        { provide: MatPaginatorIntl, useClass: MatPaginatorIntlRus },
        { provide: DateAdapter, useClass: MomentUtcDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: CUSTOM_MAT_DATE_FORMATS },
        AuthService,
        SidenavStateService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
