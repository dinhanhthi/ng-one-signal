import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OnesignalNgxModule } from 'onesignal-ngx';

import { AppComponent } from './app/app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, OnesignalNgxModule],
  bootstrap: [AppComponent]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
