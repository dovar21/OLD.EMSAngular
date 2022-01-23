import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
    selector: 'app-confirm-modal-dialog',
    templateUrl: './confirm-modal-dialog.component.html',
    styleUrls: ['./confirm-modal-dialog.component.sass']
})
export class ConfirmModalDialogComponent {

    constructor(public dialogRef: MatDialogRef<ConfirmModalDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: { title: string, text: string }
    ) {}

    /**
     * Modal method of choice for submit.
     */
    yes(): void {
        this.dialogRef.close(true);
    }

    /**
     * Modal method of choice for cancel.
     */
    no(): void {
        this.dialogRef.close(false);
    }

}
