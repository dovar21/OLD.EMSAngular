import { Component, OnInit, OnDestroy } from '@angular/core';
import { Item, SmppService } from './smpp.service';
import { fade } from 'src/app/animations/all';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';

@Component({
    selector: 'smpp-settings',
    templateUrl: './smpp.component.html',
    animations: [fade]
})
export class SmppComponent implements OnInit, OnDestroy {
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

    constructor(private service: SmppService) { }

    ngOnInit() {
        this.getSettings();
    }

    getSettings() {
        this.isRequesting = true;

        this.service
            .getSMPPSettings()
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

    /**
     * Re set default label if chenged.
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

    expandCreateForm() {
        if (this.items[0].providerName !== 'Создание конфигурации') {
            this.items.unshift({
                providerName: 'Создание конфигурации',
                hostName: '',
                portNumber: 0,
                userName: '',
                password: '',
                systemType: '',
                sourceAddressTon: 0,
                sourceAddressNpi: 0,
                sourceAddressAutodetect: true,
                destAddressTon: 0,
                destAddressNpi: 0,
                interfaceVersion: '',
                deliveryUserAckRequest: '',
                intermediateNotification: true,
                dataEncoding: '',
                validityPeriod: 0,
                transceiverMode: 0,
                receivePort: 0,
                enquireLinkInterval: 0,
                waitAckExpire: 0,
                maxPendingSubmits: 0,
                throughput: 0,
                isDefault: true,
                isActive: true,
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

        console.log(config);
    }

    ngOnDestroy() { }
}
