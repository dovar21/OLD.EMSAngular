import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { SidenavStateService } from '../dashboard-layout/sidenav-state.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';

@Component({
    selector: 'main-navigation',
    templateUrl: './main-navigation.component.html',
    styleUrls: ['./main-navigation.component.sass']
})
export class MainNavigationComponent
    implements OnInit, AfterViewInit, OnDestroy {
    /**
     * Granted permissions
     */
    permissions: object = this.app.grantedPermissions;

    /**
     * Component config object
     */
    config = {
        classname: 'main-navigation',
        fontColor: '#D2D7E8',
        selectedListFontColor: '#533DFE',
        interfaceWithRoute: true,
        highlightOnSelect: true,
        collapseOnSelect: true
    };

    appitems = [
        {
            label: 'Рабочий стол',
            icon: 'desktop_windows',
            link: '/'
        },
        {
            // hidden: true,
            label: 'Новости и информация',
            icon: 'library_books',
            items: [
                { label: 'Новости', link: '/information/news' },
                {
                    hidden: this.permissions['UsefulLinks.List'] ? false : true,
                    label: 'Полезные ссылки',
                    link: '/information/useful-links'
                },
                { label: 'Файловый архив', link: '/information/file-archive' }
            ]
        },
        {
            label: 'Товары',
            icon: 'local_offer',
            link: '/products'
        },
        {
            label: 'Контрагенты',
            icon: 'work',
            link: '/counterparties'
        },
        {
            hidden: true,
            label: 'Склады',
            icon: 'storage',
            items: [
                { label: 'Все склады', link: '/warehouses/add' },
                { label: 'Импорт на склад', link: '/warehouses/import' },
                {
                    label: 'Перемещение между складами',
                    link: '/warehouses/movement'
                },
                { label: 'Продажа со склада', link: '/warehouses/sales' },
                { label: 'Списание', link: '/warehouses/write-off' },
                { label: 'Ревизия', link: '/warehouses/audit' }
            ]
        },
        {
            hidden: true,
            label: 'Магазины',
            icon: 'shopping_cart',
            items: [
                { label: 'Все магазины', link: '/stores' },
                {
                    label: 'Количественный отчет по продажам',
                    link: '/stores/quantitative-report'
                },
                {
                    label: 'Все продажи по магазинам',
                    link: '/stores/all-sales'
                },
                {
                    label: 'Все продажи по товарам',
                    link: '/stores/sales-by-goods'
                },
                {
                    label: 'Возврат товаров на склад',
                    link: '/stores/returns-to-warehouse'
                }
            ]
        },
        {
            hidden: true,
            label: 'Ярмарки',
            icon: 'store',
            items: [
                { label: 'Новая ярмарка', link: '/fairs/add' },
                {
                    label: 'Активные ярмарки',
                    link: '/fairs'
                },
                {
                    label: 'Архив',
                    link: '/fairs/archieved'
                }
            ]
        },
        {
            hidden: true,
            label: 'Бухгалтерия',
            icon: 'keyboard'
        },
        {
            hidden: true,
            label: 'Транспорт',
            icon: 'directions_car'
        },
        {
            // hidden: true, TODO: need permissions
            label: 'Справочники',
            icon: 'view_list',
            items: [
                {
                    hidden: this.permissions['Departments.List'] ? false : true,
                    label: 'Отделы',
                    link: '/dictionaries/departments'
                },
                {
                    hidden: this.permissions['Positions.List'] ? false : true,
                    label: 'Должности',
                    link: '/dictionaries/positions'
                },
                {
                    hidden: this.permissions['Nationalities.List']
                        ? false
                        : true,
                    label: 'Национальности',
                    link: '/dictionaries/nationalities'
                },
                {
                    hidden: this.permissions['EmployeeLockReasons.List']
                        ? false
                        : true,
                    label: 'Причины блокировки сотрудников',
                    link: '/dictionaries/employee-lock-reasons'
                },
                {
                    hidden: this.permissions['UserLockReasons.List']
                        ? false
                        : true,
                    label: 'Причины блокировки пользователей',
                    link: '/dictionaries/user-lock-reasons'
                },
                {
                    hidden: this.permissions['NewsCategories.List']
                        ? false
                        : true,
                    label: 'Категории новостей',
                    link: '/dictionaries/news-categories'
                },
                {
                    hidden: this.permissions['UsefulLinkCategories.List']
                        ? false
                        : true,
                    label: 'Категории полезных ссылок',
                    link: '/dictionaries/useful-link-categories'
                },
                {
                    hidden: this.permissions['FileArchiveCategories.List']
                        ? false
                        : true,
                    label: 'Категории файлов',
                    link: '/dictionaries/file-categories'
                },
                {
                    hidden: this.permissions['ProductGroups.List']
                        ? false
                        : true,
                    label: 'Группы товаров',
                    link: '/dictionaries/product-groups'
                },
                {
                    hidden: this.permissions['Units.List'] ? false : true,
                    label: 'Единицы измерения',
                    link: '/dictionaries/units'
                },
                {
                    hidden: this.permissions['Tare.List'] ? false : true,
                    label: 'Тара',
                    link: '/dictionaries/tare'
                },
                {
                    // TODO: заполнить Permissions
                    label: 'Коды ТН ВЭД',
                    link: '/dictionaries/product-classification-codes'
                },
                {
                    hidden: this.permissions['Countries.List'] ? false : true,
                    label: 'Страны производства',
                    link: '/dictionaries/countries'
                },
                {
                    hidden: this.permissions['Brands.List'] ? false : true,
                    label: 'Бренды',
                    link: '/dictionaries/brands'
                },
                {
                    // hidden: this.permissions['Statuses.List'] ? false : true,
                    label: 'Статусы',
                    link: '/dictionaries/statuses'
                }
            ]
        },
        {
            label: 'Администрирование',
            icon: 'settings_input_component',
            items: [
                {
                    hidden: this.permissions['Employees.List'] ? false : true,
                    label: 'Сотрудники',
                    items: [
                        {
                            hidden: this.permissions['Employees.Create']
                                ? false
                                : true,
                            label: 'Добавить',
                            link: '/administration/employees/create'
                        },
                        {
                            hidden: this.permissions['Employees.List']
                                ? false
                                : true,
                            label: 'Активные',
                            link: '/administration/employees/active'
                        },
                        {
                            hidden: this.permissions['Employees.List']
                                ? false
                                : true,
                            label: 'Заблокированные',
                            link: '/administration/employees/locked'
                        }
                    ]
                },
                {
                    label: 'Системные настройки',
                    link: '/administration/settings'
                },
                {
                    label: 'История',
                    items: [
                        {
                            label: 'Email',
                            link: '/administration/history/email'
                        },
                        {
                            label: 'SMS',
                            link: '/administration/history/sms'
                        }
                    ]
                },
                {
                    hidden: true,
                    label: 'Административно-территориальное деление',
                    link: '/administration/administrative-divisions'
                },
                {
                    hidden: true,
                    label: 'Организационная структура SUMR',
                    link: '/administration/organizational-structure'
                }
            ]
        }
    ];

    /**
     * Determines if it's app init state.
     */
    isInit: boolean;

    constructor(
        private app: AppComponent,
        private sidenavService: SidenavStateService,
        private breakpointObserver: BreakpointObserver
    ) {}

    ngOnInit() {
        this.isInit = true;
    }

    ngAfterViewInit() {
        this.isInit = false;
    }

    /**
     * Close sedebar on screens less that 767px wide.
     */
    closeSideBarOnSmallScreen(event) {
        if (!this.isInit) {
            this.breakpointObserver
                .observe('(max-width: 767px)')
                .pipe(takeUntil(componentDestroyed(this)))
                .subscribe((state: BreakpointState) => {
                    if (state.matches)
                        this.sidenavService.onSideNavToggle.emit(false);
                });
        }
    }

    ngOnDestroy() {}
}
