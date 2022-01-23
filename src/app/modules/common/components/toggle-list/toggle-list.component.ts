import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from '../../utils';

@Component({
    selector: 'toggle-list',
    templateUrl: './toggle-list.component.html',
    styleUrls: ['./toggle-list.component.sass']
})
export class ToggleListComponent implements OnInit, OnDestroy {
    /**
     * An array of item to list.
     */
    @Input() items: any[];

    /**
     * Predefined data types describing passed entities.
     */
    @Input() dataType: string;

    /**
     * Event to emit on list item selection.
     */
    @Output() onSelect: EventEmitter<string> = new EventEmitter();

    /**
     * Contains an ID of passed entity item that is active now, what
     * gets determined from listening query params.
     */
    activeItemId: number;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.queryParams.pipe(takeUntil(componentDestroyed(this))).subscribe(params => {
            if (this.dataType === 'categories') this.activeItemId = params.categoryId;
        });
    }

    /**
     * Toggle list item.
     * @param value Data to be emitted.
     */
    select(value: string) {
        this.onSelect.emit(value);
    }

    ngOnDestroy() {}
}
