import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CounterpartyContact, CounterpartyService } from '../../counterparty.service';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from '../../../common/utils';
import { CounterpartyContactCreateUpdateComponent } from '../../counterparty-contact-create-update/counterparty-contact-create-update.component';
import { CounterpartyContactViewComponent } from '../../counterparty-contact-view/counterparty-contact-view.component';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'counterparty-contacts-tab',
    templateUrl: './counterparty-contacts-tab.component.html',
    styleUrls: ['./counterparty-contacts-tab.component.sass']
})
export class CounterpartyContactsTabComponent implements OnChanges, OnDestroy {
    /**
     * Creation form.
     */
    form: FormGroup;

    // -------------------------------------------------------------------------
    // Inputs / Outputs
    // -------------------------------------------------------------------------

    /**
     * Counterparty.
     */
    @Input()
    counterpartyId: number;

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * CounterpartyContact values.
     */
    counterpartContacts: CounterpartyContact[];

    // -------------------------------------------------------------------------
    // Private properties
    // -------------------------------------------------------------------------


    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private service: CounterpartyService,
                private route: ActivatedRoute,
                private snackbar: MatSnackBar,
                private dialog: MatDialog) {
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnChanges(changes: SimpleChanges) {
        if (changes['counterpartyId'] && changes['counterpartyId'].currentValue) {
            this.route.queryParams
                .pipe(takeUntil(componentDestroyed(this)))
                .subscribe(params => {
                    if (params.tabs === 'contacts') this.getCounterpartContacts();
                });
        }
    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    /**
     * @param counterpartContact view.
     */
    openDialogContactView(counterpartContact: CounterpartyContact) {
        const {id, fullName, countryName, positionName, contacts,description,photoPath, photoPathSmall  } = counterpartContact;
        const dialogRef = this.dialog.open(CounterpartyContactViewComponent, {
            data: {
                counterpartyId: this.counterpartyId,
                id,
                fullName,
                countryName,
                positionName,
                contacts,
                description,
                photoPath,
                photoPathSmall,
                counterpartContacts: this.counterpartContacts,
            },
            panelClass: 'full-width-dialog'
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(result => {
                if (result === 'submit') {
                    const foundCountry = this.counterpartContacts.find(counterpartContact => counterpartContact.id === counterpartContact.id);
                    this.counterpartContacts.splice(this.counterpartContacts.indexOf(foundCountry), 1);
                }
            });
    }

    /**
     * Create or update dictionary sub-values
     */
    openDialogCreateUpdate(counterpartContact?: CounterpartyContact): void {
        const dialogRef = this.dialog.open(CounterpartyContactCreateUpdateComponent, {
            data: {
                counterpartyId: this.counterpartyId,
                id: counterpartContact && counterpartContact.id,
                fullName: counterpartContact && counterpartContact.fullName,
                countryName: counterpartContact && counterpartContact.countryName,
                positionName: counterpartContact && counterpartContact.positionName,
                contacts: counterpartContact && counterpartContact.contacts,
                description: counterpartContact && counterpartContact.description,
                photoPathSmall: counterpartContact && counterpartContact.photoPathSmall,
            },
            panelClass: 'full-width-dialog'
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(result => {
                if (result === 'submit') {
                    this.getCounterpartContacts();
                }
            });
    }

    /**
     * Get counterpartContacts.
     * @param contact remove of counterpart contacts
     */
    untieCounterpartContact(contact: CounterpartyContact) {
        if (this.isRequesting) return;

        this.isRequesting = true;
        const fullName = contact.fullName;

        this.service
            .untieContact(contact.id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    const foundContact = this.counterpartContacts.find(counterpartContact => counterpartContact.id === contact.id);
                    this.counterpartContacts.splice(this.counterpartContacts.indexOf(foundContact), 1);
                    this.snackbar.open(fullName + ' удален из списка контактов.');
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
    private getCounterpartContacts() {
        this.service
            .getCounterpartyContacts(this.counterpartyId)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => (this.counterpartContacts = response.data));
    }
}
