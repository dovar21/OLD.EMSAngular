import { Component } from '@angular/core';

@Component({
    selector: 'app-image-uploader',
    templateUrl: './image-uploader.component.html',
    styleUrls: ['./image-uploader.component.sass']
})
export class ImageUploaderComponent {
    /**
     * Renders image to given img tag
     * @param file File object
     * @param canvas CSS selector of the element where the image should be rendered
     */
    static renderImagePreview(files: FileList, canvas: string = '.photo-preview') {
        const reader = new FileReader();

        reader.onload = (event: any) => {
            document.querySelector(canvas).setAttribute('src', event.target.result);
        };

        reader.readAsDataURL(files[0]);
    }

    /**
     * Clears preview canvas
     * @param canvas CSS selector of the element where the image should be rendered
     */
    static clearImagePreview(canvas = '.photo-preview', type: string = 'photo') {
        let placeholder = '../assets/img/noavatar.jpg';

        if (type === 'image') placeholder = '../assets/img/image-placeholder.svg';

        document.querySelector(canvas).setAttribute('src', placeholder);
    }
}
