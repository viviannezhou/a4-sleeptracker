import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { importProvidersFrom } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    //use iOS styling everywhere, since the app follows Apple's design guidelines
    provideIonicAngular({mode: 'ios'}),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    // set up Ionic Storage, using IndexedDB first (like the lecture 16 demo)
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: '__sleepdb',
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
      })
    )
  ],
});