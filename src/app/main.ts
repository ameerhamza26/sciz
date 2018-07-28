import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';


function DeepLinkHandler(data) {
    console.log("inside DeepLinkHandler");
    if (data) {
        alert('Data from deep link: ' + JSON.stringify(data));
    } else {
        alert('No data found');
    }
}

platformBrowserDynamic().bootstrapModule(AppModule);
