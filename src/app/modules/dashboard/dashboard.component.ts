import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AdministrationEmployeeService } from '../administration/administration-employee/administration-employee.service';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from '../common/utils';
import { fade } from '../../animations/all';
import { NewsAndInfoService } from '../../information/information.service';
import { DictionaryDepartmentsService } from '../dictionary/dictionary-departments/dictionary-departments.service';

// const Muuri = require('muuri');

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.sass'],
    animations: [fade]
})
export class DashboardComponent implements OnDestroy, OnInit, AfterViewInit {
    /**
     * Muuri.js options.
     */
    muuriOptions = {
        dragEnabled: true
    };

    draggableGrid: any;

    /**
     * Widgets data.
     */
    widgets = {
        counter: [],
        lastNews: null,
        lastEmployees: null
    };

    constructor(
        private employeesService: AdministrationEmployeeService,
        private departmentsService: DictionaryDepartmentsService,
        private informationService: NewsAndInfoService
    ) {}

    ngOnInit() {
        this.getEmployees();
        this.getUsers();
        this.getDepartments();
        this.getNews();
    }

    ngAfterViewInit() {
        this.initGrid();
    }

    /**
     * Initialize grid.
     */
    private initGrid() {
        setTimeout(() => {
            // this.draggableGrid = new Muuri('.draggable-grid', this.muuriOptions);
        });
    }

    /**
     * Get administration-employee.
     */
    private getEmployees() {
        this.employeesService
            .get({ pageSize: 4 })
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.widgets.counter.push({
                    title: 'Сотрудников',
                    count: response.data.totalCount,
                    link: ['administration/employees/'],
                    buttonLabel: 'Посмотреть всех',
                    icon: {
                        value: 'perm_contact_calendar',
                        size: '8rem',
                        right: '-14px',
                        bottom: '-14px'
                    }
                });

                this.widgets['lastEmployees'] = response.data.items;

                this.initGrid();
            });
    }

    /**
     * Get users
     */
    private getUsers() {
        this.employeesService
            .get({ onlyUsers: true, pageSize: 1 })
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.widgets.counter.push({
                    title: 'Пользователей',
                    count: response.data.totalCount,
                    link: ['administration/employees'],
                    queryParams: { onlyUsers: true },
                    buttonLabel: 'Посмотреть всех',
                    icon: {
                        value: 'account_circle',
                        size: '8rem',
                        right: '-9px',
                        bottom: '-9px'
                    }
                });

                this.initGrid();
            });
    }

    /**
     * Get dictionary-departments.
     */
    private getDepartments() {
        this.departmentsService
            .getList({ pageSize: 1 })
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.widgets.counter.push({
                    title: 'Отделов',
                    count: response.data.totalCount,
                    link: 'dictionaries/departments',
                    buttonLabel: 'Посмотреть все',
                    icon: {
                        value: 'view_module',
                        right: '-17px',
                        bottom: '-35px'
                    }
                });

                this.initGrid();
            });
    }

    /**
     * Get news.
     */
    private getNews() {
        this.informationService
            .getList('News', { pageSize: 5 })
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => {
                this.widgets['lastNews'] = response.data.items;

                this.initGrid();
            });
    }

    ngOnDestroy() {}
}
