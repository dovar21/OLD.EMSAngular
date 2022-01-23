import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { fade } from 'src/app/animations/all';
import { SmtpService, Item } from './smtp.service';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';

@Component({
    selector: 'smtp-settings',
    templateUrl: './smtp.component.html',
    animations: [fade]
})
export class SmtpComponent implements OnInit, OnDestroy {
    /**
     * Determines whether any fetch operation is in progress
     */
    isRequesting: boolean;

    /**
     *
     * Requested entity items.
     */
    items: Item[];

    /**
     * Acardion expand panel index
     */
    expandedPanelIndex: number;

    /**
     * Determines whether fetching resulted with an error.
     */
    errorLoadingResults: boolean;

    constructor(private service: SmtpService) {}

    ngOnInit() {
        this.getSettings();
    }

    /**
     * Re-set default label if chenged.
     * @param config Created or edited config.
     */
    setDefault(config: Item) {
        if (config.isDefault) {
            this.items.forEach(item => {
                if (item.id === config.id) item.isDefault = true;
                else item.isDefault = false;
            });
        }
    }

    getSettings() {
        this.isRequesting = true;

        this.service
            .getEmailSettings()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.items = response.data;
                    this.errorLoadingResults = false;
                },
                () => {
                    this.isRequesting = false;
                    this.errorLoadingResults = true;
                },
                () => (this.isRequesting = false)
            );
    }

    expandCreateForm() {
        if (this.items[0].mailServerName !== 'Создание конфигурации') {
            this.items.unshift({
                mailServerName: 'Создание конфигурации',
                mailServer: '',
                mailPort: 465,
                senderName: '',
                sender: '',
                ssl: true,
                password: '',
                isDefault: false,
                isActive: true
            });

            this.expandedPanelIndex = 0;
        }
    }

    /**
     * Add created or edited config to the array.
     * @param config Newly created or edited config.
     */
    addConfig(config: Item) {
        this.items.unshift(config);
    }

    /**
     * Delete passed item from items array.
     * @param id Config ID.
     */
    delete(id: number) {
        this.items = this.items.filter(item => item.id !== id);
    }

    ngOnDestroy() {}
}
