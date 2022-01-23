import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment-timezone';
import { MatSnackBar } from '@angular/material';
import { fade } from 'src/app/animations/all';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NewsAndInfoService, NewsArticle } from '../information.service';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { momentX, componentDestroyed } from 'src/app/modules/common/utils';
import { CKEDITOR_CONFIG } from 'src/app/app.config';
import { takeUntil } from 'rxjs/operators';
import { DictionaryNewsCategory } from '../../modules/dictionary/dictionary-news-categories/dictionary-news-categories.service';

@Component({
    selector: 'create-update-news-article',
    templateUrl: './create-update-news-article.component.html',
    animations: [fade]
})
export class CreateUpdateNewsArticleComponent implements OnInit, OnDestroy {

    /**
     * Shown cropping True || False
     */
    croppingMode: boolean;

    /**
 * Uploaded image by input
 */
    uploadedImage: FileList;

    /**
     * Image select
     */
    imagePreview: string;
    /**
     * Determines whether any fetch operation is in progress.
     */
    isRequesting: boolean;

    /**
     * CKEditor
     */
    Editor = ClassicEditor;

    /**
     * CKEditor config
     */
    editorConfig = {
        ...CKEDITOR_CONFIG,
        toolbar: {
            items: [
                'heading',
                '|',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                'blockQuote',
                'insertTable',
                'mediaEmbed',
                'media',
                'undo',
                'redo'
            ]
        }
        // placeholder: 'Текст статьи'
    };

    /**
     * Dialog title.
     */
    title: string;

    /**
     * Creation form.
     */
    form: FormGroup;

    /**
     * Current date.
     */
    today: moment.Moment = moment();

    /**
     * Maximum days for ahead publishing.
     */
    maxPublishAt = moment().add(30, 'days');

    /**
     * News categories.
     */
    categories: DictionaryNewsCategory[];

    /**
     * Article ID.
     */
    id: number;

    /**
     * Current article data.
     */
    articleData: NewsArticle;

    constructor(
        private fb: FormBuilder,
        private snackbar: MatSnackBar,
        private service: NewsAndInfoService,
        private route: ActivatedRoute,
        public location: Location
    ) {
        this.form = fb.group({
            title: fb.control('', Validators.required),
            newsCategoryId: fb.control('', Validators.required),
            publishAt: fb.control(this.today, Validators.required),
            publishAtTime: fb.control(this.today, Validators.required),
            description: fb.control('', Validators.required),
            imageFile: fb.control(''),
            isActive: fb.control(true),
            shortDescription: fb.control('', Validators.required)
        });
    }

    ngOnInit() {
        // Get and assign article ID if we want to update existing one.
        this.route.paramMap.pipe(takeUntil(componentDestroyed(this))).subscribe(params => (this.id = +params.get('id')));
        this.title = this.route.snapshot.data.title;
        this.getCategories();

        if (this.id) this.getArticle();
    }

    /**
     * Get signle article data by id.
     */
    private getArticle() {
        this.form.disable();

        this.service
            .getById('News', +this.id)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.setTitle(response.data.title);

                    this.form.patchValue({
                        ...response.data,
                        publishAt: momentX(response.data.publishAt),
                        publishAtTime: response.data.publishAt.split(' ')[1]
                    });

                    this.imagePreview = response.data.imagePath;
                    this.articleData = response.data;
                },
                (error: Response) => this.form.enable(),
                () => this.form.enable()
            );
    }

    /**
     * Get news categories.
     */
    private getCategories() {
        this.form.disable();

        this.service
            .getCategories('NewsCategories')
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.categories = response.data;
                },
                (error: Response) => this.form.enable(),
                () => this.form.enable()
            );
    }

    /**
     * Set card title.
     * @param title New title
     */
    setTitle(title: string) {
        if (title !== '') this.title = title;
        else this.title = this.route.snapshot.data.title;
    }

    /**
      * Renders selected image to given img tag and assigns it to respective
      * form field
      * @param files Files object
      */
    uploadFile(files: FileList) {
        if (!files || (files && !files[0])) return;

        const fileReader = new FileReader();
        fileReader.readAsDataURL(files[0]);
        fileReader.onload = (e) => {
            const target: any = e.target;
            this.uploadedImage = target.result;
            this.croppingMode = true;
        }
    }

    onSubmitCrop(image: string) {
        this.form.get('imageFile').patchValue(image);
        this.croppingMode = false;
        if (image) this.imagePreview = image;
    }


    /**
     * Set CKEditor output to class field.
     */
    setDescription({ editor }: ChangeEvent) {
        this.form.get('description').setValue(editor.getData());
    }

    /**
     * Create or edit article.
     */
    submit() {
        // Don't submit if form has errors
        if (this.form.invalid) {
            this.snackbar.open('В форме содержатся ошибки');

            return false;
        }

        let time = this.form.get('publishAtTime').value;

        // Format and merge date and time for news publish
        let dateTime = moment(this.form.get('publishAt').value)
            .set('hours', parseInt(time[0] + time[1]))
            .set('minutes', parseInt(time[2] + time[3]))
            .set('seconds', 0)
            .format('DD.MM.YYYY HH:mm:ss');

        const payload = {
            ...this.form.value,
            publishAt: dateTime,
            id: this.id
        }

        delete payload.publishAtTime;

        let action = 'Edit'

        if (!this.id) {
            action = 'Create';
            delete payload.id;
        }

        this.form.disable();

        this.service
            .submit(action, 'News', payload)
            .pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                response => {
                    this.snackbar.open('Статья сохранена.');
                    this.location.back();
                },
                (error: Response) => this.form.enable(),
                () => this.form.enable()
            );
    }

    ngOnDestroy() { }
}
