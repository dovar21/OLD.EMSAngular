import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from '../../common/utils';
import { CounterpartyService } from '../counterparty.service';
import { CounterpartyOfficeCreateUpdateComponent } from '../counterparty-office-create-update/counterparty-office-create-update.component';

@Component({
    selector: 'counterparty-office-view',
    templateUrl: './counterparty-office-view.component.html',
    styleUrls: ['./counterparty-office-view.component.sass']
})
export class CounterpartyOfficeViewComponent implements OnDestroy {

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * Data set in page object.
     */
    setData: any;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRefView: MatDialogRef<CounterpartyOfficeViewComponent>,
                private service: CounterpartyService,
                private dialogRefEdit: MatDialog,
                private snackbar: MatSnackBar) {
        this.setData = data;
    }

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
    editOffice(): void {
        this.dialogRefEdit.open(CounterpartyOfficeCreateUpdateComponent, {
            data: {
                id: this.data.id,
                counterparty: this.data.counterparty,
                countryName: this.data.countryName,
                address: this.data.address,
                contacts: this.data.contacts,
                description: this.data.description,
                isPrimary: this.data.isPrimary,
            }
        });
        this.dialogRefView.close();
    }

    /**
     * Handle redirection logic after form submit.
     */
    removeOffice() {
        this.isRequesting = true;
        this.service
            .untieOffice(this.data.id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    // this.snackbar.open( foundOffice.fullName + 'успешно удален');
                    this.isRequesting = false;
                    this.dialogRefView.close('submit');
                });
    }
}
