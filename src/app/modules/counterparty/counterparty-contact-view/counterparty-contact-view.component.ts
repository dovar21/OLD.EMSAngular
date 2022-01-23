import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from '../../common/utils';
import { CounterpartyService } from '../counterparty.service';
import { CounterpartyContactCreateUpdateComponent } from '../counterparty-contact-create-update/counterparty-contact-create-update.component';

@Component({
    selector: 'counterparty-contact-view',
    templateUrl: './counterparty-contact-view.component.html',
    styleUrls: ['./counterparty-contact-view.component.sass']
})
export class CounterpartyContactViewComponent implements OnDestroy {

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRefView: MatDialogRef<CounterpartyContactViewComponent>,
                private service: CounterpartyService,
                private dialogRefEdit: MatDialog,
                private snackbar: MatSnackBar,) {}

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------


    /**
     * Update dictionary sub-values
     */
    editContact(): void {
        this.dialogRefEdit.open(CounterpartyContactCreateUpdateComponent, {
            data: {
                id: this.data.id,
                fullName: this.data.fullName,
                countryName: this.data.countryName,
                positionName: this.data.positionName,
                contacts: this.data.contacts,
                description: this.data.description,
                photoPathSmall: this.data.photoPathSmall,
            },
            panelClass: 'full-width-dialog'
        });
        this.dialogRefView.close();
    }

    /**
     * Handle redirection logic after form submit.
     */
    removeContact() {
        const foundCountry = this.data.counterpartContacts.find(counterpartContact => counterpartContact.id === this.data.id);

        this.isRequesting = true;
        this.service
            .untieContact(this.data.id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.snackbar.open( foundCountry.fullName + 'успешно удален');
                    this.isRequesting = false;
                    this.dialogRefView.close('submit');
                });
    }
}
