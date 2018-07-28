import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicePaymentPage } from './service-payment';

@NgModule({
  declarations: [
    ServicePaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicePaymentPage),
  ],
})
export class ServicePaymentPageModule {}
