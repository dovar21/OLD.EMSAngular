import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { MatDialog, MatSnackBar } from "@angular/material";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
    CounterpartyService,
    CounterpartOffices, Counterparty
} from '../../counterparty.service';
import { takeUntil } from "rxjs/operators";
import { componentDestroyed } from "../../../common/utils";
import { ActivatedRoute } from "@angular/router";
import { CounterpartyOfficeCreateUpdateComponent } from "../../counterparty-office-create-update/counterparty-office-create-update.component";
import { CounterpartyOfficeViewComponent } from "../../counterparty-office-view/counterparty-office-view.component";

@Component({
    selector: "counterparty-offices-tab",
    templateUrl: "./counterparty-offices-tab.component.html",
    styleUrls: ["./counterparty-offices-tab.component.sass"]
})
export class CounterpartyOfficesTabComponent implements OnChanges, OnDestroy {
    /**
     * Creation form.
     */
    form: FormGroup;

    // -------------------------------------------------------------------------
    // Inputs / Outputs
    // -------------------------------------------------------------------------

    /**
     * CounterpartOffices values.
     */
    @Input()
    counterparty: Counterparty;

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Product counterparty offices
     */
    counterpartOffices: CounterpartOffices[];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private service: CounterpartyService,
                private route: ActivatedRoute,
                private snackbar: MatSnackBar,
                private dialog: MatDialog) {}

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnChanges(changes: SimpleChanges) {
        if (changes['counterparty'] && changes['counterparty'].currentValue) {
            this.route.queryParams
                .pipe(takeUntil(componentDestroyed(this)))
                .subscribe(params => {
                    if (params.tabs === 'offices') this.getCounterpartOffices();
                });
        }
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * @param counterpartOffice view.
     */
    openDialogContactView(counterpartOffice: CounterpartOffices) {
        const dialogRef = this.dialog.open(CounterpartyOfficeViewComponent, {
            data: {
                counterparty: this.counterparty,
                id: counterpartOffice && counterpartOffice.id,
                countryName: counterpartOffice && counterpartOffice.countryName,
                address: counterpartOffice && counterpartOffice.address,
                contacts: counterpartOffice && counterpartOffice.contacts,
                description: counterpartOffice && counterpartOffice.description,
                isPrimary: counterpartOffice && counterpartOffice.isPrimary,
                counterpartOffices: this.counterpartOffices
            },
            panelClass: "full-width-dialog"
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(result => {
                if (result === "submit") {
                    const foundOffice = this.counterpartOffices.find(office => office.id === counterpartOffice.id);
                    if (foundOffice.isPrimary) delete this.counterparty.headOffice;
                    this.counterpartOffices.splice(this.counterpartOffices.indexOf(foundOffice), 1);
                }
            });
    }

    /**
     * Create or update counterpartOffice
     */
    openDialogCreateUpdate(counterpartOffice?: CounterpartOffices): void {
        const dialogRef = this.dialog.open(
            CounterpartyOfficeCreateUpdateComponent,
            {
                data: {
                    id: counterpartOffice && counterpartOffice.id,
                    counterparty: this.counterparty,
                    countryName: counterpartOffice && counterpartOffice.countryName,
                    address: counterpartOffice && counterpartOffice.address,
                    contacts: counterpartOffice && counterpartOffice.contacts,
                    description: counterpartOffice && counterpartOffice.description,
                    isPrimary: counterpartOffice && counterpartOffice.isPrimary
                }
            }
        );

        dialogRef
            .afterClosed()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(result => {
                if (result === "submit") {
                    this.getCounterpartOffices();
                }
            });
    }

    /**
     * Get counterpartContacts.
     * @param counterpartOffice remove of counterpart offices
     */
    untieCounterpartContact(counterpartOffice: CounterpartOffices) {
        if (this.isRequesting) return;

        this.isRequesting = true;
        const fullName = counterpartOffice.countryName;

        this.service
            .untieOffice(counterpartOffice.id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    const foundOffice = this.counterpartOffices.find(office => office.id === counterpartOffice.id);
                    if (foundOffice.isPrimary) delete this.counterparty.headOffice;

                    this.counterpartOffices.splice(this.counterpartOffices.indexOf(foundOffice),1);
                    this.snackbar.open("Оффис удален из списка.");
                    // this.snackbar.open(fullName + ' удален из списка контактов.');
                },
                error => (this.isRequesting = false),
                () => (this.isRequesting = false)
            );
    }

    // -------------------------------------------------------------------------
    // Private methods
    // -------------------------------------------------------------------------

    /**
     * Get counterpartContacts by counterparty ID.
     */
    private getCounterpartOffices() {
        this.service
            .getCounterpartyOffices(this.counterparty.id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => (this.counterpartOffices = response.data));
    }
}
