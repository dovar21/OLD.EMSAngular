import { Subject } from 'rxjs';

export class BootController {
    private static instance: BootController;
    private reboot: Subject<boolean> = new Subject();
    private reboot$ = this.reboot.asObservable();

    static getbootControl() {
        if (!BootController.instance) {
            BootController.instance = new BootController();
        }
        return BootController.instance;
    }

    watchReboot() {
        return this.reboot$;
    }

    restart() {
        this.reboot.next(true);
    }
}
