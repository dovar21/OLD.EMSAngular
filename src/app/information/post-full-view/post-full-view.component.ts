import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsAndInfoService, Item } from '../information.service';
import { ActivatedRoute } from '@angular/router';
import { fade } from 'src/app/animations/all';
import { Location } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/modules/common/utils';

@Component({
    selector: 'app-post-full-view',
    templateUrl: './post-full-view.component.html',
    styleUrls: ['./post-full-view.component.sass'],
    animations: [fade]
})
export class PostFullViewComponent implements OnInit, OnDestroy {
    /**
     * Post full data.
     */
    post: Item;

    /**
     * Post ID.
     */
    private id: number;

    constructor(private service: NewsAndInfoService, private route: ActivatedRoute, public location: Location) {}

    ngOnInit() {
        this.route.paramMap.pipe(takeUntil(componentDestroyed(this))).subscribe(params => {
            this.id = +params.get('id')
        });
        this.getById();
    }

    /**
     * Get post by ID.
     */
    private getById() {
        this.service
            .getById('News', this.id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(response => (this.post = response.data));
    }

    ngOnDestroy() {}
}
