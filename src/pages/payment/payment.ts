import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RavePaymentPage } from '../rave-payment/rave-payment';
import { StripePaymentPage } from '../stripe-payment/stripe-payment';

/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  creation:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
    this.creation = this.navParams.get('creation');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
  }

  goBack(){
    this.navCtrl.pop();
  }

  presentAlert(title,subTitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  openRave() {
    if (this.creation.price == undefined){
      this.presentAlert("Error","Unable to process payment, no amount specified")
    }

    else {
      this.navCtrl.push(RavePaymentPage,{
        creation: this.creation,
        view:'service'
      });
    }

  }

  openStripe() {
    if (this.creation.price == undefined){
      this.presentAlert("Error","Unable to process payment, no amount specified")
    }

    this.navCtrl.push(StripePaymentPage,{
      creation: this.creation,
      view:'service'
    });
  }

}
