import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../material/material.module';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonComponentsModule} from '../common/components/common-components.module';
import {DictionaryDepartmentsListComponent} from './dictionary-departments/dictionary-departments-list/dictionary-departments-list.component';
import {DictionaryDepartmentsFilterComponent} from './dictionary-departments/dictionary-departments-filter/dictionary-departments-filter.component';
import {DictionaryDepartmentsCreateUpdateComponent} from './dictionary-departments/dictionary-departments-create-update/dictionary-departments-create-update.component';
import {DictionaryDepartmentsLogsComponent} from './dictionary-departments/dictionary-departments-logs/dictionary-departments-logs.component';
import {DictionaryUsefulLinksCategoriesListComponent} from './dictionary-useful-links-categories/dictionary-useful-links-categories-list/dictionary-useful-links-categories-list.component';
import {DictionaryUsefulLinksCategoriesFilterComponent} from './dictionary-useful-links-categories/dictionary-useful-links-categories-filter/dictionary-useful-links-categories-filter.component';
import {DictionaryUsefulLinksCategoriesCreateUpdateComponent} from './dictionary-useful-links-categories/dictionary-useful-links-categories-create-update/dictionary-useful-links-categories-create-update.component';
import {DictionaryUsefulLinksCategoriesLogsComponent} from './dictionary-useful-links-categories/dictionary-useful-links-categories-logs/dictionary-useful-links-categories-logs.component';
import {DictionaryFilesCategoriesListComponent} from './dictionary-files-categories/dictionary-files-categories-list/dictionary-files-categories-list.component';
import {DictionaryFilesCategoriesFilterComponent} from './dictionary-files-categories/dictionary-files-categories-filter/dictionary-files-categories-filter.component';
import {DictionaryFilesCategoriesCreateUpdateComponent} from './dictionary-files-categories/dictionary-create-update-files-categories/dictionary-files-categories-create-update.component';
import {DictionaryFilesCategoriesLogsComponent} from './dictionary-files-categories/dictionary-files-categories-logs/dictionary-files-categories-logs.component';
import {DictionaryProductsGroupsCreateUpdateComponent} from './dictionary-products-groups/dictionary-products-groups-create-update/dictionary-products-groups-create-update.component';
import {DictionaryProductsGroupsFilterComponent} from './dictionary-products-groups/dictionary-products-groups-filter/dictionary-products-groups-filter.component';
import {DictionaryProductsGroupsListComponent} from './dictionary-products-groups/dictionary-products-groups-list/dictionary-products-groups-list.component';
import {DictionaryProductsGroupsLogsComponent} from './dictionary-products-groups/dictionary-products-groups-logs/dictionary-products-groups-logs.component';
import {DictionaryUnitsListComponent} from './dictionary-units/dictionary-units-list/dictionary-units-list.component';
import {DictionaryUnitsFilterComponent} from './dictionary-units/dictionary-units-filter/dictionary-units-filter.component';
import {DictionaryUnitsCreateUpdateComponent} from './dictionary-units/dictionary-units-create-update/dictionary-units-create-update.component';
import {DictionaryUnitsLogsComponent} from './dictionary-units/dictionary-units-logs/dictionary-units-logs.component';
import {DictionaryTareListComponent} from './dictionary-tare/dictionary-tare-list/dictionary-tare-list.component';
import {DictionaryTareFilterComponent} from './dictionary-tare/dictionary-tare-filter/dictionary-tare-filter.component';
import {DictionaryTareCreateUpdateComponent} from './dictionary-tare/dictionary-tare-create-update/dictionary-tare-create-update.component';
import {DictionaryTareLogsComponent} from './dictionary-tare/dictionary-tare-logs/dictionary-tare-logs.component';
import {DictionaryProductsClassificationCodesListComponent} from './dictionary-products-classification-codes/dictionary-products-classification-codes-list/dictionary-products-classification-codes-list.component';
import {DictionaryProductsClassificationCodesFilterComponent} from './dictionary-products-classification-codes/dictionary-products-classification-codes-filter/dictionary-products-classification-codes-filter.component';
import {DictionaryProductsClassificationCodesCreateUpdateComponent} from './dictionary-products-classification-codes/dictionary-products-classification-codes-create-update/dictionary-products-classification-codes-create-update.component';
import {DictionaryProductsClassificationCodesLogsComponent} from './dictionary-products-classification-codes/dictionary-products-classification-codes-logs/dictionary-products-classification-codes-logs.component';
import {DictionaryCountriesListComponent} from './dictionary-countries/dictionary-countries-list/dictionary-countries-list.component';
import {DictionaryCountriesFilterComponent} from './dictionary-countries/dictionary-countries-filter/dictionary-countries-filter.component';
import {DictionaryCountriesCreateUpdateComponent} from './dictionary-countries/dictionary-countries-create-update/dictionary-countries-create-update.component';
import {DictionaryCountriesLogsComponent} from './dictionary-countries/dictionary-countries-logs/dictionary-countries-logs.component';
import {DictionaryBrandsListComponent} from './dictionary-brands/dictionary-brands-list/dictionary-brands-list.component';
import {DictionaryBrandsFilterComponent} from './dictionary-brands/dictionary-brands-filter/dictionary-brands-filter.component';
import {DictionaryBrandsCreateUpdateComponent} from './dictionary-brands/dictionary-brands-create-update/dictionary-brands-create-update.component';
import {DictionaryBrandsLogsComponent} from './dictionary-brands/dictionary-brands-logs/dictionary-brands-logs.component';
import {DictionaryUserLockReasonsListComponent} from './dictionary-user-lock-reasons/dictionary-user-lock-reasons-list/dictionary-user-lock-reasons-list.component';
import {DictionaryUserLockReasonsFilterComponent} from './dictionary-user-lock-reasons/dictionary-user-lock-reasons-filter/dictionary-user-lock-reasons-filter.component';
import {DictionaryUserLockReasonsCreateUpdateComponent} from './dictionary-user-lock-reasons/dictionary-user-lock-reasons-create-updaate/dictionary-user-lock-reasons-create-update.component';
import {DictionaryUserLockReasonsLogsComponent} from './dictionary-user-lock-reasons/dictionary-user-lock-reasons-logs/dictionary-user-lock-reasons-logs.component';
import {DictionaryPositionsListComponent} from './dictionary-positions/dictionary-positions-list/dictionary-positions-list.component';
import {DictionaryPositionsFilterComponent} from './dictionary-positions/dictionary-positions-filter/dictionary-positions-filter.component';
import {DictionaryPositionsCreateUpdateComponent} from './dictionary-positions/dictionary-positions-create-update/dictionary-positions-create-update.component';
import {DictionaryPositionsLogsComponent} from './dictionary-positions/dictionary-positions-logs/dictionary-positions-logs.component';
import {EmployeeLockReasonsListComponent} from './dictionary-employee-lock-reasons/employee-lock-reasons-list/employee-lock-reasons-list.component';
import {DictionaryEmployeeLockReasonsFilterComponent} from './dictionary-employee-lock-reasons/dictionary-employee-lock-reasons-filter/dictionary-employee-lock-reasons-filter.component';
import {DictionaryEmployeeLockReasonsCreateUpdateComponent} from './dictionary-employee-lock-reasons/dictionary-employee-lock-reasons-create-update/dictionary-employee-lock-reasons-create-update.component';
import {DictionaryEmployeeLockReasonsLogsComponent} from './dictionary-employee-lock-reasons/dictionary-employee-lock-reasons-logs/dictionary-employee-lock-reasons-logs.component';
import {DictionaryNewsCategoriesListComponent} from './dictionary-news-categories/dictionary-news-categories-list/dictionary-news-categories-list.component';
import {DictionaryNewsCategoriesFilterComponent} from './dictionary-news-categories/dictionary-news-categories-filter/dictionary-news-categories-filter.component';
import {DictionaryNewsCategoriesCreateUpdateComponent} from './dictionary-news-categories/dictionary-news-categories-create-update/dictionary-news-categories-create-update.component';
import {DictionaryNewsCategoriesLogsComponent} from './dictionary-news-categories/dictionary-news-categories-logs/dictionary-news-categories-logs.component';
import {DictionaryNationalitiesListComponent} from './dictionary-nationalities/dictionary-nationalities-list/dictionary-nationalities-list.component';
import {DictionaryNationalitiesFilterComponent} from './dictionary-nationalities/dictionary-nationalities-filter/dictionary-nationalities-filter.component';
import {DictionaryNationalitiesCreateUpdateComponent} from './dictionary-nationalities/dictionary-nationalities-create-update/dictionary-nationalities-create-update.component';
import {DictionaryNationalitiesLogsComponent} from './dictionary-nationalities/dictionary-nationalities-logs/dictionary-nationalities-logs.component';
import { DictionaryDepartmentsFilterListComponent } from './dictionary-departments/dictionary-departments-filter-list/dictionary-departments-filter-list.component';
import { DictionaryPositionsFilterListComponent } from './dictionary-positions/dictionary-positions-filter-list/dictionary-positions-filter-list.component';
import { DictionaryTareFilterListComponent } from './dictionary-tare/dictionary-tare-filter-list/dictionary-tare-filter-list.component';
import { DictionaryProductsClassificationCodesFilterListComponent } from './dictionary-products-classification-codes/dictionary-products-classification-codes-filter-list/dictionary-products-classification-codes-filter-list.component';
import { DictionaryCountriesFilterListComponent } from './dictionary-countries/dictionary-countries-filter-list/dictionary-countries-filter-list.component';
import { DictionaryBrandsFilterListComponent } from './dictionary-brands/dictionary-brands-filter-list/dictionary-brands-filter-list.component';
import { DictionaryNationalitiesFilterListComponent } from './dictionary-nationalities/dictionary-nationalities-filter-list/dictionary-nationalities-filter-list.component';
import { DictionaryEmployeeLockReasonsFilterListComponent } from './dictionary-employee-lock-reasons/dictionary-employee-lock-reasons-filter-list/dictionary-employee-lock-reasons-filter-list.component';
import { DictionaryUserLockReasonsFilterListComponent } from './dictionary-user-lock-reasons/dictionary-user-lock-reasons-filter-list/dictionary-user-lock-reasons-filter-list.component';
import { DictionaryNewsCategoriesFilterListComponent } from './dictionary-news-categories/dictionary-news-categories-filter-list/dictionary-news-categories-filter-list.component';
import { DictionaryUsefulLinksCategoriesFilterListComponent } from './dictionary-useful-links-categories/dictionary-useful-links-categories-filter-list/dictionary-useful-links-categories-filter-list.component';
import { DictionaryFilesCategoriesFilterListComponent } from './dictionary-files-categories/dictionary-files-categories-filter-list/dictionary-files-categories-filter-list.component';
import { DictionaryProductsGroupsFilterListComponent } from './dictionary-products-groups/dictionary-products-groups-filter-list/dictionary-products-groups-filter-list.component';
import { DictionaryUnitsFilterListComponent } from './dictionary-units/dictionary-units-filter-list/dictionary-units-filter-list.component';
import { DictionaryStatusesListComponent } from './dictionary-statuses/dictionary-statuses-list/dictionary-statuses-list.component';
import { DictionaryStatusesFilterComponent } from './dictionary-statuses/dictionary-statuses-filter/dictionary-statuses-filter.component';
import { DictionaryStatusesFilterListComponent } from './dictionary-statuses/dictionary-statuses-filter-list/dictionary-statuses-filter-list.component';
import { DictionaryStatusesLogsComponent } from './dictionary-statuses/dictionary-statuses-logs/dictionary-statuses-logs.component';
import { DictionaryStatusesCreateUpdateComponent } from './dictionary-statuses/dictionary-statuses-create-update/dictionary-statuses-create-update.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelPropagation: false
};

@NgModule({
    declarations: [
        DictionaryDepartmentsListComponent,
        DictionaryDepartmentsFilterComponent,
        DictionaryDepartmentsFilterListComponent,
        DictionaryDepartmentsCreateUpdateComponent,
        DictionaryDepartmentsLogsComponent,
        DictionaryPositionsListComponent,
        DictionaryPositionsFilterComponent,
        DictionaryPositionsFilterListComponent,
        DictionaryPositionsCreateUpdateComponent,
        DictionaryPositionsLogsComponent,
        DictionaryTareListComponent,
        DictionaryTareFilterComponent,
        DictionaryTareFilterListComponent,
        DictionaryTareCreateUpdateComponent,
        DictionaryTareLogsComponent,
        DictionaryProductsClassificationCodesListComponent,
        DictionaryProductsClassificationCodesFilterComponent,
        DictionaryProductsClassificationCodesFilterListComponent,
        DictionaryProductsClassificationCodesCreateUpdateComponent,
        DictionaryProductsClassificationCodesLogsComponent,
        DictionaryCountriesListComponent,
        DictionaryCountriesFilterComponent,
        DictionaryCountriesFilterListComponent,
        DictionaryCountriesCreateUpdateComponent,
        DictionaryCountriesLogsComponent,
        DictionaryBrandsListComponent,
        DictionaryBrandsFilterComponent,
        DictionaryBrandsFilterListComponent,
        DictionaryBrandsCreateUpdateComponent,
        DictionaryBrandsLogsComponent,
        DictionaryNationalitiesListComponent,
        DictionaryNationalitiesFilterComponent,
        DictionaryNationalitiesFilterListComponent,
        DictionaryNationalitiesCreateUpdateComponent,
        DictionaryNationalitiesLogsComponent,
        EmployeeLockReasonsListComponent,
        DictionaryEmployeeLockReasonsFilterListComponent,
        DictionaryEmployeeLockReasonsFilterComponent,
        DictionaryEmployeeLockReasonsCreateUpdateComponent,
        DictionaryEmployeeLockReasonsLogsComponent,
        DictionaryUserLockReasonsListComponent,
        DictionaryUserLockReasonsFilterComponent,
        DictionaryUserLockReasonsFilterListComponent,
        DictionaryUserLockReasonsCreateUpdateComponent,
        DictionaryUserLockReasonsLogsComponent,
        DictionaryNewsCategoriesListComponent,
        DictionaryNewsCategoriesFilterComponent,
        DictionaryNewsCategoriesFilterListComponent,
        DictionaryNewsCategoriesCreateUpdateComponent,
        DictionaryNewsCategoriesLogsComponent,
        DictionaryUsefulLinksCategoriesListComponent,
        DictionaryUsefulLinksCategoriesFilterComponent,
        DictionaryUsefulLinksCategoriesFilterListComponent,
        DictionaryUsefulLinksCategoriesCreateUpdateComponent,
        DictionaryUsefulLinksCategoriesLogsComponent,
        DictionaryFilesCategoriesListComponent,
        DictionaryFilesCategoriesFilterComponent,
        DictionaryFilesCategoriesFilterListComponent,
        DictionaryFilesCategoriesCreateUpdateComponent,
        DictionaryFilesCategoriesLogsComponent,
        DictionaryProductsGroupsListComponent,
        DictionaryProductsGroupsFilterComponent,
        DictionaryProductsGroupsFilterListComponent,
        DictionaryProductsGroupsCreateUpdateComponent,
        DictionaryProductsGroupsLogsComponent,
        DictionaryUnitsListComponent,
        DictionaryUnitsFilterComponent,
        DictionaryUnitsFilterListComponent,
        DictionaryUnitsCreateUpdateComponent,
        DictionaryUnitsLogsComponent,
        DictionaryStatusesListComponent,
        DictionaryStatusesFilterComponent,
        DictionaryStatusesFilterListComponent,
        DictionaryStatusesCreateUpdateComponent,
        DictionaryStatusesLogsComponent,

    ],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        MaterialModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterModule,
        PerfectScrollbarModule,
        CommonComponentsModule
    ],
    entryComponents: [
        DictionaryDepartmentsCreateUpdateComponent,
        DictionaryDepartmentsFilterComponent,
        DictionaryPositionsFilterComponent,
        DictionaryPositionsCreateUpdateComponent,
        DictionaryTareFilterComponent,
        DictionaryTareCreateUpdateComponent,
        DictionaryProductsClassificationCodesFilterComponent,
        DictionaryProductsClassificationCodesCreateUpdateComponent,
        DictionaryCountriesFilterComponent,
        DictionaryCountriesCreateUpdateComponent,
        DictionaryBrandsFilterComponent,
        DictionaryBrandsCreateUpdateComponent,
        DictionaryNationalitiesFilterComponent,
        DictionaryNationalitiesCreateUpdateComponent,
        DictionaryEmployeeLockReasonsFilterComponent,
        DictionaryEmployeeLockReasonsCreateUpdateComponent,
        DictionaryUserLockReasonsFilterComponent,
        DictionaryUserLockReasonsCreateUpdateComponent,
        DictionaryNewsCategoriesFilterComponent,
        DictionaryNewsCategoriesCreateUpdateComponent,
        DictionaryUsefulLinksCategoriesFilterComponent,
        DictionaryUsefulLinksCategoriesCreateUpdateComponent,
        DictionaryFilesCategoriesFilterComponent,
        DictionaryFilesCategoriesCreateUpdateComponent,
        DictionaryProductsGroupsFilterComponent,
        DictionaryProductsGroupsCreateUpdateComponent,
        DictionaryUnitsFilterComponent,
        DictionaryUnitsCreateUpdateComponent,
        DictionaryStatusesFilterComponent,
        DictionaryStatusesCreateUpdateComponent,
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ]
})
export class DictionaryModule {}
