import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspirationModalPage } from './inspiration-modal';

@NgModule({
  declarations: [
    InspirationModalPage,
  ],
  imports: [
    IonicPageModule.forChild(InspirationModalPage),
  ],
})
export class InspirationModalPageModule {}