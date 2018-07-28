import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Http, Headers, RequestOptions} from '@angular/http';
import { Stripe } from '@ionic-native/stripe';
import { AngularFireDatabase } from 'angularfire2/database';
import { InspirationPage } from '../inspiration/inspiration';

import {AppSettings} from '../../providers/app-settings';
import {DataService} from '../../providers/data-service';
import {UserService} from '../../providers/user-service';

/**
 * Generated class for the StripePaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stripe-payment',
  templateUrl: 'stripe-payment.html',
})
export class StripePaymentPage {
  stripeURL = this.appSettings.getStripeURL();
  stripePK = this.appSettings.getStripePK();

  number : any = "";
  expMonth : any = "";
  expYear : any = "";
  cvc : any = "";
  name	: any = "";
  address_line1	: any = "";
  address_line2	: any = "";
  address_city : any = "";
  address_state	: any = "";
  address_country	: any = "";
  postalCode	: any = "";
  currency	: any = "";
  description : any = "";
  email : any = "";
  amount : any = "";

  user:any;
  loading:any;
  creation : any;
  provider: any;
  purchaseDetails: any;
  paymentEmail: any;
  serviceProviderEmail:any;

  constructor(public userService:UserService, public toastCtrl: ToastController, public dataService:DataService, public appSettings:AppSettings, public loadingCtrl: LoadingController, public navCtrl: NavController, public db: AngularFireDatabase, private alertCtrl: AlertController, public navParams: NavParams, public stripe: Stripe, public Http: Http) {
    this.user = this.userService.user;
    this.creation = this.navParams.get('purchaseDetails');

    if (this.creation.type == 'service'){
      this.purchaseDetails = this.navParams.get('purchaseDetails');
      console.log(this.purchaseDetails)
    }

    else {
      this.provider =  this.dataService.users.filter(item => item.code == this.creation.userCode)[0];
      console.log(this.provider);

      this.purchaseDetails = {
        type : 'store',
        name : this.provider.name,
        email : this.provider.email,
        mobile : this.provider.phone,
        item : this.creation.name,
        itemImage : this.creation.image,
        bankAccountHolder : this.provider.bankAccountHolder,
        bankAccountNumber : this.provider.bankAccountNumber,
        bankAccountSortCode : this.provider.bankAccountSortCode,
        status : 'false'
      }
      console.log(this.purchaseDetails)
    }

    this.email = this.user.email


    if (this.creation.price.charAt(0) == '£'){
      this.currency = "gbp"
      this.amount = this.creation.price.substring(1)
    }

    else if (this.creation.price.charAt(0) == '$'){
      this.currency = "usd"
      this.amount = this.creation.price.substring(1)
    }

    else if (this.creation.price.charAt(0) == '€'){
      this.currency = "eur"
      this.amount = this.creation.price.substring(1)
    }

    else if (this.creation.price.charAt(0) == 'N'){
      this.currency = "ngn"
      this.amount = this.creation.price.substring(1)
    }

    else {
      this.amount = this.creation.price
    }

    this.paymentEmail = {
      sender : this.user.name + ' ' + this.user.email,
      provider : this.purchaseDetails.name + ' ' + this.purchaseDetails.email,
      item : this.purchaseDetails.item,
      amount : this.amount,
      currency : this.currency,
      bankAccountHolder : this.purchaseDetails.bankAccountHolder,
      bankAccountNumber : this.purchaseDetails.bankAccountNumber,
      bankAccountSortCode : this.purchaseDetails.bankAccountSortCode
    }

    this.serviceProviderEmail = {
      provider : this.purchaseDetails.email,
      sender : this.user.name + ' ' + this.user.email,
      item : this.purchaseDetails.item,
      currency : this.currency,
      amount : this.amount,
      dueDate : this.purchaseDetails.completionDate,
      address :this.purchaseDetails.address,
      measurements : this.purchaseDetails.measurement,
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StripePaymentPage');
  }

  ////////////////////////////////////////////////////////////////////////////////

  presentLoading(message) {
    this.loading = this.loadingCtrl.create({
      content: message
    });

    this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
    }, 5000);
  }

  ////////////////////////////////////////////////////////////////////////////////

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000
    });
    toast.present();
  }

  ////////////////////////////////////////////////////////////////////////////////

  presentAlert(title, message) {
  let alert = this.alertCtrl.create({
    title: title,
    subTitle: message,
    buttons: ['Dismiss']
  });
  alert.present();
  }

  ////////////////////////////////////////////////////////////////////////////////

  sendFirstConfirmationEmail(body) {
    this.presentLoading('Please wait ..');
    let headers =  new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    let url = this.dataService.raveURL + "sendFirstConfirmationEmail";

    this.Http.post(url, JSON.stringify(body), options).map(response => response.json()).subscribe(data => {
      console.log(JSON.stringify(data))
      if (data == "success") {
      }
      else {
        this.presentAlert("Error", "Payment made, please contact and inform service provider");
      }
    },
    error => {
      this.loading.dismissAll();
    })
  }

  ////////////////////////////////////////////////////////////////////////////////

  sendEmailtoServiceProvider(body) {
    this.presentLoading('Please wait ..');
    let headers =  new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    let url = this.dataService.raveURL + "sendEmailtoServiceProvider";

    this.Http.post(url, JSON.stringify(body), options).map(response => response.json()).subscribe(data => {
      console.log(JSON.stringify(data))
      if (data == "success") {
      }
    },
    error => {
      this.loading.dismissAll();
      this.presentAlert("Error", "Payment made, please contact and inform service provider");
    })
  }

  ////////////////////////////////////////////////////////////////////////////////

  pay() {
    this.presentLoading('Please wait ..');
    let cardinfo = {
      number : this.number,
      expMonth : this.expMonth,
      expYear : this.expYear,
      cvc : this.cvc,
      name	: this.name,
      address_line1	: this.address_line1,
      address_line2	: this.address_line2,
      address_city : this.address_city,
      address_state	: this.address_state,
      address_country	: this.address_country,
      postalCode	: this.postalCode,
    };

    this.stripe.setPublishableKey(this.dataService.stripePK);

    this.stripe.createCardToken(cardinfo)
      .then(token => {

        var body = {
          amount: this.amount*100,
          currency : this.currency,
          description : this.description,
          stripetoken: token.id,
          email : this.email,
          metadata : this.purchaseDetails
        }

       let headers =  new Headers({ "Content-Type": "application/json" });
       let options = new RequestOptions({ headers: headers });
       let url = this.dataService.stripeURL + "processpay";


       //JSON.stringify(body)
       this.Http.post(url, JSON.stringify(body), options).map(response => response.json()).subscribe(data => {
         console.log(data)
         if (data.status == "succeeded"){
           this.loading.dismissAll();
           this.presentAlert("Success", data.outcome.seller_message);

           //save data to the DB
           const promise = this.db.list('/' + 'stripe-payments' + '/' + this.user.code + '/' + data.id).push(data);
           promise
           .then( (res) => {
             //message successfully sent
             this.sendFirstConfirmationEmail(this.paymentEmail);

             if (this.purchaseDetails.type = 'service'){
               this.sendEmailtoServiceProvider(this.serviceProviderEmail)
             }

             this.presentToast("Successfully pushed data to the database")
           })
           //.catch(function (err) {
             //some error and the message wasn't sent
             //this.presentToast("Error while pushing data to the database")
           //});

           this.navCtrl.setRoot(InspirationPage);
         }
         else {
           this.loading.dismissAll();
           this.presentAlert("Error", data.message);
         }
       },
       error => {
         this.loading.dismissAll();
         this.presentAlert("Error", error);
       })
     }).catch(error => {
       this.loading.dismissAll();
       this.presentAlert("Error", error)

     });
   }

}
