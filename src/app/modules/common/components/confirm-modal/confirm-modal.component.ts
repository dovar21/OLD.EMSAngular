import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmModalDialogComponent } from './confirm-modal-dialog.component';

@Component({
    selector: "confirm-modal",
    template: ``,
})
export class ConfirmModalComponent {

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    /**
     * Text for modal header.
     */
    @Input()
    modalTitle: string;

    /**
     * Text for modal description.
     */
    @Input()
    confirmText: string;

    /**
     * Modal label of choice for submit.
     */
    @Input()
    confirmLabel: string = "Да";

    /**
     * Modal label of choice for cancel.
     */
    @Input()
    dismissLabel: string = "Нет";

    // -------------------------------------------------------------------------
    // Outputs
    // -------------------------------------------------------------------------

    @Output()
    onConfirm = new EventEmitter();

    @Output()
    onDismiss = new EventEmitter();

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(public dialog: MatDialog) {
    }

    // -------------------------------------------------------------------------
    // Host Listeners
    // -------------------------------------------------------------------------

    /**
     * Open confirm modal dialog.
     */
    open(...args: any[]) {
        const dialogRef = this.dialog.open(ConfirmModalDialogComponent, {
            data: { title: this.modalTitle, text: this.confirmText }
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.onConfirm.emit(args);
            } else {
                this.onDismiss.emit();
            }
        });
    }

}
