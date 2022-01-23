import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { fade } from 'src/app/animations/all';
import { AppComponent } from 'src/app/app.component';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Counterparty } from '../../counterparty.service';

@Component({
    selector: 'counterparty-last-waybills-card',
    templateUrl: './counterparty-last-waybills-card.component.html',
    styleUrls: ['./counterparty-last-waybills-card.component.sass'],
    animations: [fade]
})
export class CounterpartyLastWaybillsCardComponent implements OnInit, OnDestroy {

    // -------------------------------------------------------------------------
    // Inputs / Outputs
    // -------------------------------------------------------------------------

    /**
     * Counterparty to be populated.
     */
    @Input()
    counterparty: Counterparty;

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------


    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private snackbar: MatSnackBar,
                private app: AppComponent,
                private fb: FormBuilder
    ) {}

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {

    }

    ngOnDestroy() {}

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

}
