import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { hmrBootstrap } from './hmr';

import 'hammerjs';
import { BootController } from './app/modules/common/boot-control';
import { takeUntil } from 'rxjs/operators';

if (environment.production) {
    enableProdMode();
}

// if (environment.hmr) {
//     if (module['hot']) {
//         hmrBootstrap(module, () => platformBrowserDynamic().bootstrapModule(AppModule));
//     } else {
//         console.error('HMR is not enabled for webpack-dev-server!');
//         console.log('Are you using the --hmr flag for ng serve?');
//     }
// }

// platformBrowserDynamic()
//     .bootstrapModule(AppModule)
//     .catch(err => console.error(err));

const init = () => {
    platformBrowserDynamic()
        .bootstrapModule(AppModule)
        .then(() => (<any>window).appBootstrap && (<any>window).appBootstrap())
        .catch(err => console.error('NG Bootstrap Error =>', err));
};

// Init on first load
init();

// Init on reboot request
const boot = BootController.getbootControl()
    .watchReboot()
    .subscribe(() => init());
