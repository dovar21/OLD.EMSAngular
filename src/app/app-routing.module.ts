import { AuthGuard } from './modules/authentication/auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { AuthComponent } from './modules/authentication/auth.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { AdministrationEmployeeListComponent } from './modules/administration/administration-employee/administration-employee-list/administration-employee-list.component';
import { AdministrationEmployeeViewComponent } from './modules/administration/administration-employee/administration-employee-view/administration-employee-view.component';
import { CreateEmployeeComponent } from './modules/administration/administration-employee/administration-employee-create-update/administration-employee-create-update.component';
import { AdministrationEmployeeUpdatePassportDataComponent } from './modules/administration/administration-employee/administration-employee-update-passport-data/administration-employee-update-passport-data.component';
import { MyProfileComponent } from './modules/administration/users/my-profile/my-profile.component';
import { NewsAndUsefulLinksListComponent } from './information/list/list.component';
import { CreateUpdateNewsArticleComponent } from './information/create-update-news-article/create-update-news-article.component';
import { PostFullViewComponent } from './information/post-full-view/post-full-view.component';
import { MailComponent } from './modules/mail/mail.component';
import { SystemSettingsComponent } from './modules/administration/system-settings/system-settings.component';
import { EmailListComponent } from './modules/administration/history/email/email-list/email-list.component';
import { SmsComponent } from './modules/administration/history/sms/sms.component';
import { DictionaryDepartmentsListComponent } from './modules/dictionary/dictionary-departments/dictionary-departments-list/dictionary-departments-list.component';
import { DictionaryDepartmentsLogsComponent } from './modules/dictionary/dictionary-departments/dictionary-departments-logs/dictionary-departments-logs.component';
import { DictionaryUsefulLinksCategoriesListComponent } from './modules/dictionary/dictionary-useful-links-categories/dictionary-useful-links-categories-list/dictionary-useful-links-categories-list.component';
import { DictionaryUsefulLinksCategoriesLogsComponent } from './modules/dictionary/dictionary-useful-links-categories/dictionary-useful-links-categories-logs/dictionary-useful-links-categories-logs.component';
import { DictionaryFilesCategoriesListComponent } from './modules/dictionary/dictionary-files-categories/dictionary-files-categories-list/dictionary-files-categories-list.component';
import { DictionaryFilesCategoriesLogsComponent } from './modules/dictionary/dictionary-files-categories/dictionary-files-categories-logs/dictionary-files-categories-logs.component';
import { DictionaryProductsGroupsListComponent } from './modules/dictionary/dictionary-products-groups/dictionary-products-groups-list/dictionary-products-groups-list.component';
import { DictionaryProductsGroupsLogsComponent } from './modules/dictionary/dictionary-products-groups/dictionary-products-groups-logs/dictionary-products-groups-logs.component';
import { DictionaryUnitsListComponent } from './modules/dictionary/dictionary-units/dictionary-units-list/dictionary-units-list.component';
import { DictionaryUnitsLogsComponent } from './modules/dictionary/dictionary-units/dictionary-units-logs/dictionary-units-logs.component';
import { DictionaryTareListComponent } from './modules/dictionary/dictionary-tare/dictionary-tare-list/dictionary-tare-list.component';
import { DictionaryTareLogsComponent } from './modules/dictionary/dictionary-tare/dictionary-tare-logs/dictionary-tare-logs.component';
import { DictionaryProductsClassificationCodesListComponent } from './modules/dictionary/dictionary-products-classification-codes/dictionary-products-classification-codes-list/dictionary-products-classification-codes-list.component';
import { DictionaryProductsClassificationCodesLogsComponent } from './modules/dictionary/dictionary-products-classification-codes/dictionary-products-classification-codes-logs/dictionary-products-classification-codes-logs.component';
import { DictionaryCountriesLogsComponent } from './modules/dictionary/dictionary-countries/dictionary-countries-logs/dictionary-countries-logs.component';
import { DictionaryCountriesListComponent } from './modules/dictionary/dictionary-countries/dictionary-countries-list/dictionary-countries-list.component';
import { DictionaryBrandsListComponent } from './modules/dictionary/dictionary-brands/dictionary-brands-list/dictionary-brands-list.component';
import { DictionaryBrandsLogsComponent } from './modules/dictionary/dictionary-brands/dictionary-brands-logs/dictionary-brands-logs.component';
import { DictionaryUserLockReasonsListComponent } from './modules/dictionary/dictionary-user-lock-reasons/dictionary-user-lock-reasons-list/dictionary-user-lock-reasons-list.component';
import { DictionaryUserLockReasonsLogsComponent } from './modules/dictionary/dictionary-user-lock-reasons/dictionary-user-lock-reasons-logs/dictionary-user-lock-reasons-logs.component';
import { DictionaryPositionsListComponent } from './modules/dictionary/dictionary-positions/dictionary-positions-list/dictionary-positions-list.component';
import { DictionaryPositionsLogsComponent } from './modules/dictionary/dictionary-positions/dictionary-positions-logs/dictionary-positions-logs.component';
import { EmployeeLockReasonsListComponent } from './modules/dictionary/dictionary-employee-lock-reasons/employee-lock-reasons-list/employee-lock-reasons-list.component';
import { DictionaryEmployeeLockReasonsLogsComponent } from './modules/dictionary/dictionary-employee-lock-reasons/dictionary-employee-lock-reasons-logs/dictionary-employee-lock-reasons-logs.component';
import { DictionaryNewsCategoriesListComponent } from './modules/dictionary/dictionary-news-categories/dictionary-news-categories-list/dictionary-news-categories-list.component';
import { DictionaryNewsCategoriesLogsComponent } from './modules/dictionary/dictionary-news-categories/dictionary-news-categories-logs/dictionary-news-categories-logs.component';
import { DictionaryNationalitiesListComponent } from './modules/dictionary/dictionary-nationalities/dictionary-nationalities-list/dictionary-nationalities-list.component';
import { DictionaryNationalitiesLogsComponent } from './modules/dictionary/dictionary-nationalities/dictionary-nationalities-logs/dictionary-nationalities-logs.component';
import { ProductListComponent } from './modules/product/product-list/product-list.component';
import { ProductViewComponent } from './modules/product/product-view/product-view-component';
import { CounterpartyListComponent } from './modules/counterparty/counterparty-list/counterparty-list.component';
import { CounterpartyViewComponent } from './modules/counterparty/counterparty-view/counterparty-view-component';
import { RoutePermissionsGuard } from './authentication/route-permissions-guard.service';
import { DictionaryStatusesListComponent } from './modules/dictionary/dictionary-statuses/dictionary-statuses-list/dictionary-statuses-list.component';
import { DictionaryStatusesLogsComponent } from './modules/dictionary/dictionary-statuses/dictionary-statuses-logs/dictionary-statuses-logs.component';

const routes: Routes = [
    {
        path: '',
        data: { title: 'SAMR' },
        component: DashboardLayoutComponent,
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: '',
                component: DashboardComponent,
                data: { title: '?????????????? ????????' }
            },
            {
                path: 'messages',
                data: { title: '??????????????????' },
                children: [
                    {
                        path: '',
                        component: MailComponent,
                        data: { messagesType: 'inbox' }
                    },
                    {
                        path: 'inbox',
                        component: MailComponent,
                        data: { messagesType: 'inbox' }
                    },
                    {
                        path: 'sent',
                        component: MailComponent,
                        data: { messagesType: 'sent' }
                    }
                ]
            },
            {
                path: 'information',
                data: { title: '?????????????? ?? ????????????????????' },
                children: [
                    {
                        path: 'news',
                        children: [
                            {
                                path: '',
                                component: NewsAndUsefulLinksListComponent,
                                data: {
                                    title: '??????????????',
                                    controllerName: 'News'
                                }
                            },
                            {
                                path: 'create',
                                component: CreateUpdateNewsArticleComponent,
                                data: {
                                    title: '???????????????????? ??????????????',
                                    permissions: ['News.Create']
                                },
                                canActivate: [RoutePermissionsGuard]
                            },
                            {
                                path: 'edit/:id',
                                component: CreateUpdateNewsArticleComponent,
                                data: {
                                    title: '???????????????????????????? ??????????????',
                                    permissions: ['News.Update']
                                },
                                canActivate: [RoutePermissionsGuard]
                            },
                            {
                                path: ':id',
                                component: PostFullViewComponent,
                                data: {
                                    isFullView: true
                                }
                            }
                        ]
                    },
                    {
                        path: 'useful-links',
                        component: NewsAndUsefulLinksListComponent,
                        data: {
                            title: '???????????????? ????????????',
                            controllerName: 'UsefulLinks',
                            permissions: ['UsefulLinks.List']
                        },
                        canActivate: [RoutePermissionsGuard]
                    },
                    {
                        path: 'file-archive',
                        component: NewsAndUsefulLinksListComponent,
                        data: {
                            title: '???????????????? ??????????',
                            controllerName: 'File'
                        }
                    }
                ]
            },
            {
                path: 'products',
                data: { title: '????????????' },
                children: [
                    {
                        path: '',
                        component: ProductListComponent
                    },
                    {
                        path: ':id',
                        component: ProductViewComponent,
                        data: {
                            isFullView: true
                        }
                    }
                ]
            },
            {
                path: 'counterparties',
                data: { title: '??????????????????????' },
                children: [
                    {
                        path: '',
                        component: CounterpartyListComponent
                    },
                    {
                        path: ':id',
                        component: CounterpartyViewComponent,
                        data: { isFullView: true }
                    }
                ]
            },
            {
                path: 'dictionaries',
                data: { title: '??????????????????????' },
                children: [
                    {
                        path: 'departments',
                        data: {
                            title: '????????????',
                            controllerName: 'Departments',
                            permissions: ['Departments.List']
                        },
                        children: [
                            {
                                path: '',
                                component: DictionaryDepartmentsListComponent,
                            },
                            {
                                path: 'history',
                                data: { title: '??????????????', permissions: ['Departments.Details'] },
                                children: [
                                    {
                                        path: ':id',
                                        component: DictionaryDepartmentsLogsComponent
                                    }
                                ],
                                canActivate: [RoutePermissionsGuard]
                            }
                        ],
                        canActivate: [RoutePermissionsGuard]
                    },
                    {
                        path: 'useful-link-categories',
                        data: {
                            title: '???????????????? ????????????',
                            controllerName: 'UsefulLinksCategories',
                            permissions: ['UsefulLinkCategories.List']
                        },
                        children: [
                            {
                                path: '',
                                component: DictionaryUsefulLinksCategoriesListComponent
                            },
                            {
                                path: 'history',
                                data: { title: '??????????????', permissions: ['UsefulLinkCategories.Details'] },
                                children: [
                                    {
                                        path: ':id',
                                        component: DictionaryUsefulLinksCategoriesLogsComponent
                                    }
                                ],
                                canActivate: [RoutePermissionsGuard]
                            }
                        ],
                        canActivate: [RoutePermissionsGuard]
                    },
                    {
                        path: 'file-categories',
                        data: {
                            title: '?????????????????? ????????????',
                            controllerName: 'FileArchiveCategories',
                            permissions: ['FileArchiveCategories.List']
                        },
                        children: [
                            {
                                path: '',
                                component: DictionaryFilesCategoriesListComponent
                            },
                            {
                                path: 'history',
                                data: { title: '??????????????', permissions: ['FileArchiveCategories.Details'] },
                                children: [
                                    {
                                        path: ':id',
                                        component: DictionaryFilesCategoriesLogsComponent
                                    }
                                ],
                                canActivate: [RoutePermissionsGuard]
                            }
                        ],
                        canActivate: [RoutePermissionsGuard]
                    },
                    {
                        path: 'product-groups',
                        data: {
                            title: '???????????? ??????????????',
                            controllerName: 'ProductsGroups',
                            permissions: ['ProductGroups.List']
                        },
                        children: [
                            {
                                path: '',
                                component: DictionaryProductsGroupsListComponent
                            },
                            {
                                path: 'history',
                                data: { title: '??????????????', permissions: ['ProductGroups.Details'] },
                                children: [
                                    {
                                        path: ':id',
                                        component: DictionaryProductsGroupsLogsComponent
                                    }
                                ],
                                canActivate: [RoutePermissionsGuard]
                            }
                        ],
                        canActivate: [RoutePermissionsGuard]
                    },
                    {
                        path: 'units',
                        data: {
                            title: '?????????????? ??????????????????',
                            controllerName: 'Units',
                            permissions: ['Units.List']
                        },
                        children: [
                            {
                                path: '',
                                component: DictionaryUnitsListComponent
                            },
                            {
                                path: 'history',
                                data: { title: '??????????????', permissions: ['Units.Details'] },
                                children: [
                                    {
                                        path: ':id',
                                        component: DictionaryUnitsLogsComponent
                                    }
                                ],
                                canActivate: [RoutePermissionsGuard]
                            }
                        ],
                        canActivate: [RoutePermissionsGuard]
                    },
                    {
                        path: 'tare',
                        data: {
                            title: '????????',
                            controllerName: 'Tare',
                            permissions: ['Tare.List']
                        },
                        children: [
                            {
                                path: '',
                                component: DictionaryTareListComponent
                            },
                            {
                                path: 'history',
                                data: { title: '??????????????', permissions: ['Tare.Details'] },
                                children: [
                                    {
                                        path: ':id',
                                        component: DictionaryTareLogsComponent
                                    }
                                ],
                                canActivate: [RoutePermissionsGuard]
                            }
                        ],
                        canActivate: [RoutePermissionsGuard]
                    },
                    { // TODO: need permissions
                        path: 'product-classification-codes',
                        data: { title: '?????? ???? ??????', controllerName: 'ProductsClassificationCodes' },
                        children: [
                            {
                                path: '',
                                component: DictionaryProductsClassificationCodesListComponent
                            },
                            {
                                path: 'history',
                                data: { title: '??????????????' },
                                children: [
                                    {
                                        path: ':id',
                                        component: DictionaryProductsClassificationCodesLogsComponent
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        path: 'countries',
                        data: {
                            title: '???????????? ????????????????????????',
                            controllerName: 'Countries',
                            permissions: ['Countries.List']
                        },
                        children: [
                            {
                                path: '',
                                component: DictionaryCountriesListComponent
                            },
                            {
                                path: 'history',
                                data: { title: '??????????????', permissions: ['Countries.Details'] },
                                children: [
                                    {
                                        path: ':id',
                                        component: DictionaryCountriesLogsComponent
                                    }
                                ],
                                canActivate: [RoutePermissionsGuard]
                            }
                        ],
                        canActivate: [RoutePermissionsGuard]
                    },
                    {
                        path: 'brands',
                        data: {
                            title: '????????????',
                            controllerName: 'Brands',
                            permissions: ['Brands.List']
                        },
                        children: [
                            {
                                path: '',
                                component: DictionaryBrandsListComponent
                            },
                            {
                                path: 'history',
                                data: { title: '??????????????', permissions: ['Brands.Details'] },
                                children: [
                                    {
                                        path: ':id',
                                        component: DictionaryBrandsLogsComponent
                                    }
                                ],
                                canActivate: [RoutePermissionsGuard]
                            }
                        ],
                        canActivate: [RoutePermissionsGuard]
                    },
                    {
                        path: 'statuses',
                        data: {
                            title: '??????????????',
                            controllerName: 'Statuses',
                            // permissions: ['Statuses.List']
                        },
                        children: [
                            {
                                path: '',
                                component: DictionaryStatusesListComponent
                            },
                            {
                                path: 'history',
                                // data: { title: '??????????????', permissions: ['Statuses.Details'] },
                                data: { title: '??????????????' },
                                children: [
                                    {
                                        path: ':id',
                                        component: DictionaryStatusesLogsComponent
                                    }
                                ],
                            }
                        ],
                    },
                    {
                        path: 'user-lock-reasons',
                        data: {
                            title: '?????????????? ???????????????????? ??????????????????????????',
                            controllerName: 'UserLockReasons',
                            permissions: ['UserLockReasons.List']
                        },
                        children: [
                            {
                                path: '',
                                component: DictionaryUserLockReasonsListComponent
                            },
                            {
                                path: 'history',
                                data: { title: '??????????????', permissions: ['UserLockReasons.Details'] },
                                children: [
                                    {
                                        path: ':id',
                                        component: DictionaryUserLockReasonsLogsComponent
                                    }
                                ],
                                canActivate: [RoutePermissionsGuard]
                            }
                        ],
                        canActivate: [RoutePermissionsGuard]
                    },
                    {
                        path: 'positions',
                        data: {
                            title: '??????????????????',
                            controllerName: 'Positions',
                            permissions: ['Positions.List']
                        },
                        children: [
                            {
                                path: '',
                                component: DictionaryPositionsListComponent
                            },
                            {
                                path: 'history',
                                data: { title: '??????????????', permissions: ['Positions.Details'] },
                                children: [
                                    {
                                        path: ':id',
                                        component: DictionaryPositionsLogsComponent
                                    }
                                ],
                                canActivate: [RoutePermissionsGuard]
                            }
                        ],
                        canActivate: [RoutePermissionsGuard]
                    },
                    {
                        path: 'employee-lock-reasons',
                        data: {
                            title: '?????????????? ???????????????????? ??????????????????????',
                            controllerName: 'EmployeeLockReasons',
                            permissions: ['EmployeeLockReasons.List']
                        },
                        children: [
                            {
                                path: '',
                                component: EmployeeLockReasonsListComponent
                            },
                            {
                                path: 'history',
                                data: { title: '??????????????', permissions: ['DictionaryEmployeeLockReasons.Details'] },
                                children: [
                                    {
                                        path: ':id',
                                        component: DictionaryEmployeeLockReasonsLogsComponent
                                    }
                                ],
                                canActivate: [RoutePermissionsGuard]
                            }
                        ],
                        canActivate: [RoutePermissionsGuard]
                    },
                    {
                        path: 'nationalities',
                        data: {
                            title: '????????????????????????????',
                            controllerName: 'Nationalities',
                            permissions: ['Nationalities.List']
                        },
                        children: [
                            {
                                path: '',
                                component: DictionaryNationalitiesListComponent
                            },
                            {
                                path: 'history',
                                data: { title: '??????????????', permissions: ['Nationalities.Details'] },
                                children: [
                                    {
                                        path: ':id',
                                        component: DictionaryNationalitiesLogsComponent
                                    }
                                ],
                                canActivate: [RoutePermissionsGuard]
                            }
                        ],
                        canActivate: [RoutePermissionsGuard]
                    },
                    {
                        path: 'news-categories',
                        data: {
                            title: '?????????????????? ????????????????',
                            controllerName: 'NewsCategories',
                            permissions: ['NewsCategories.List']
                        },
                        children: [
                            {
                                path: '',
                                component: DictionaryNewsCategoriesListComponent
                            },
                            {
                                path: 'history',
                                data: { title: '??????????????', permissions: ['NewsCategories.Details'] },
                                children: [
                                    {
                                        path: ':id',
                                        component: DictionaryNewsCategoriesLogsComponent
                                    }
                                ],
                                canActivate: [RoutePermissionsGuard]
                            }
                        ],
                        canActivate: [RoutePermissionsGuard]
                    }
                ]
            },
            {
                path: 'administration',
                data: { title: '??????????????????????????????????' },
                children: [
                    {
                        path: 'employees',
                        data: { title: '????????????????????' },
                        children: [
                            {
                                path: '',
                                component: AdministrationEmployeeListComponent,
                                data: {
                                    title: '???????????????? ????????????????????',
                                    permissions: ['Employees.List']
                                },
                                canActivate: [RoutePermissionsGuard]
                            },
                            {
                                path: 'active',
                                component: AdministrationEmployeeListComponent,
                                data: {
                                    title: '???????????????? ????????????????????',
                                    permissions: ['Employees.List']
                                },
                                canActivate: [RoutePermissionsGuard]
                            },
                            {
                                path: 'locked',
                                component: AdministrationEmployeeListComponent,
                                data: {
                                    title: '?????????????????????????????? ????????????????????',
                                    permissions: ['Employees.List'],
                                    showLocked: true
                                },
                                canActivate: [RoutePermissionsGuard]
                            },
                            {
                                path: 'create',
                                data: {
                                    title: '???????????????????? ????????????????????',
                                    permissions: ['Employees.Create']
                                },
                                component: CreateEmployeeComponent,
                                canActivate: [RoutePermissionsGuard]
                            },
                            {
                                path: 'edit',
                                data: { title: '???????????????????????????? ????????????????????', permissions: ['Employees.Update'] },
                                canActivate: [RoutePermissionsGuard],
                                children: [
                                    {
                                        path: 'essentials/:id',
                                        data: { title: '??????????????' },
                                        component: CreateEmployeeComponent
                                    },
                                    {
                                        path: 'passport-data/:id',
                                        data: {
                                            title: '???????????????????????????? ???????????????????? ????????????'
                                        },
                                        component: AdministrationEmployeeUpdatePassportDataComponent
                                    }
                                ]
                            },
                            {
                                path: ':id',
                                data: { title: '??????????????????', permissions: ['Employees.Details'] },
                                component: AdministrationEmployeeViewComponent,
                                canActivate: [RoutePermissionsGuard]
                            }
                        ]
                    },
                    {
                        path: 'settings',
                        data: { title: 'C???????????????? ??????????????????' },
                        children: [
                            {
                                path: '',
                                component: SystemSettingsComponent
                            }
                        ]
                    },
                    {
                        path: 'history',
                        data: { title: 'History' },
                        children: [
                            {
                                path: 'email',
                                component: EmailListComponent,
                                data: { title: '?????????????? Email', controllerName: 'EmailMessagesHistory' }
                            },
                            {
                                path: 'sms',
                                component: SmsComponent,
                                data: { title: '?????????????? SMS', controllerName: 'SmsHistory' }
                            }
                        ]
                    }
                ]
            },
            {
                path: 'me',
                data: { title: '?????? ??????????????', showLocked: true },
                component: MyProfileComponent
            }
        ]
    },
    {
        path: 'auth',
        component: AuthComponent
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: true,
            onSameUrlNavigation: 'reload',
            scrollPositionRestoration: 'enabled'
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
