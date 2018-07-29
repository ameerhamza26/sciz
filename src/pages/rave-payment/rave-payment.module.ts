import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RavePaymentPage } from './rave-payment';

@NgModule({
  declarations: [
    RavePaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(RavePaymentPage),
  ],
})
export class RavePaymentPageModule {}
