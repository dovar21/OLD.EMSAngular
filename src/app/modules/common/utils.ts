import * as moment from 'moment-timezone';
import { DialogLightboxComponent } from './components/dialog-lightbox/dialog-lightbox.component';
import { MatDialog } from '@angular/material';
import { OnDestroy } from '@angular/core';
import { ReplaySubject, Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';

/**
 * Initiates download of the given blob as file
 * @param disposition Content-disposition header value
 * @param blob Blob
 */
export function downloadFileFromBlob(disposition: string, blob: Blob) {
    const fileName = decodeURIComponent(disposition.split('filename*=')[1].split(`''`)[1]);
    const fileUrl = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.download = decodeURIComponent(fileName);
    anchor.href = fileUrl;
    anchor.click();
}

/**
 * Parses date from string with given format and Timezone.
 * @param date Date as string
 */
export function momentX(date: string) {
    return moment.utc(date, 'DD.MM.YYYY', 'Asia/Dushanbe').utcOffset(300);
}

/**
 * Convert given object to query string.
 * @param source Object
 */
export function buildQueryParams(source?: Object): HttpParams {
    if (!source) return;
    let target: HttpParams = new HttpParams();
    Object.keys(source).forEach((key: string) => {
        const value: string | number | boolean | Date = source[key];
        if ((typeof value !== 'undefined') && (value !== null)) {
            target = target.append(key, value.toString());
        }
    });
    return target;
}

/**
 * Open lightbox with passed photo and name.
 * @param photoPathMax Photo path.
 * @param fullName Full name.
 */
export function openDialogLightbox(photoPathMax?: string, fullName?: string, dialog?: MatDialog, edit?: boolean, id?: number): Observable<any> {

    // if (arguments.length > 0) {}
        const dialogRef = dialog.open(DialogLightboxComponent, {
            panelClass: 'lightbox-dialog',
            maxWidth: '700px',
            data: { photoPathMax, fullName, edit, id }
        });


    // if (arguments.length === 0) {
        dialogRef.componentInstance.isRequesting = false;
        this.isRequesting = false;
        this.isImageReady = false;
    // }

    return dialogRef.componentInstance.submitChanges;
}

/**
 * Determines whether passed object is empty.
 * @param object Object to check.
 */
export function isEmptyObject(object: object = {}): boolean {
    return object.constructor === Object && Object.keys(object).length === 0;
}

/**
 * Play passed audio.
 * @param soundPath Audio sound path.
 */
export function playSound(soundPath = '../../assets/sounds/notification.mp3') {
    let audio = new Audio(soundPath);
    audio.play();
}

/**
 * Remove keys with null values from object.
 * @param object Object to execute on.
 * @returns Object with keys only containing a value.
 */
export function removeNullFromObject(object: {}) {
    Object.keys(object).forEach(key => {
        if (object[key] === null) delete object[key];
    });

    return object;
}

/**
 * Determines whether passed component was destroyed.
 * @param component Angular component.
 */
export function componentDestroyed(component: OnDestroy) {
    const oldNgOnDestroy = component.ngOnDestroy;
    const destroyed$ = new ReplaySubject<void>(1);

    component.ngOnDestroy = () => {
        oldNgOnDestroy.apply(component);
        destroyed$.next(undefined);
        destroyed$.complete();
    };

    return destroyed$;
}
