import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { InspirationPage } from '../inspiration/inspiration';

import {AppSettings} from '../../providers/app-settings';
import {DataService} from '../../providers/data-service';
import {UserService} from '../../providers/user-service';

/**
 * Generated class for the RavePaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rave-payment',
  templateUrl: 'rave-payment.html',
})
export class RavePaymentPage {
  raveURL = this.appSettings.getRaveURL();
  ravePaymentLinkURL = this.appSettings.getRavePaymentLinkURL();

  cardno: any = "";
  cvv: any = "";
  expirymonth: any = "";
  expiryyear: any = "";
  pin: any = "";
  amount: any = "";
  email: any = "";
  phonenumber: any = "";
  firstname: any = "";
  lastname: any = "";
  currency: any = "";
  billingzip: any = "";
  billingcity: any = "";
  billingaddress: any = "";
  billingstate: any = "";
  billingcountry: any = "";
  purchaseDetails: any;

  user:any;
  loading:any;
  provider:any;
  creation: any;
  paymentEmail : any;
  serviceProviderEmail : any;


  constructor(public userService:UserService, private iab: InAppBrowser, public dataService:DataService, public appSettings:AppSettings, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, public Http: Http,  private alertCtrl: AlertController) {
    this.creation = this.navParams.get('purchaseDetails');
    this.user = this.userService.user;

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
      this.currency = "GBP"
      this.amount = this.creation.price.substring(1)
    }

    else if (this.creation.price.charAt(0) == '$'){
      this.currency = "USD"
      this.amount = this.creation.price.substring(1)
    }

    else if (this.creation.price.charAt(0) == '€'){
      this.currency = "EUR"
      this.amount = this.creation.price.substring(1)
    }

    else if (this.creation.price.charAt(0) == 'N'){
      this.currency = "NGN"
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


    //this.amount = this.navParams.get('price');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RavePaymentPage');
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
  presentPaymentLink() {
    const browser = this.iab.create(this.dataService.ravePaymentLinkURL, '_system', 'location=yes');
  }

////////////////////////////////////////////////////////////////////////////////
  presentAlert(title,subTitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Dismiss']
    });
    alert.present();
  }

////////////////////////////////////////////////////////////////////////////////
  presentPinPrompt() {
    return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create({
        title: 'PIN Verification',
        message: 'Please enter your pin',
        inputs: [
          {
            name: 'PIN',
            placeholder: 'PIN',
            type: 'tel'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              resolve(false);
            }
          },
          {
            text: 'Submit',
            handler: data => {
              resolve(data.PIN)
            }
          }
        ]
      });
      alert.present();
    })
  }

////////////////////////////////////////////////////////////////////////////////
  presentOtpPrompt(message) {
    return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create({
        title: 'OTP Verification',
        message: message,
        inputs: [
          {
            name: 'OTP',
            placeholder: 'OTP',
            type: 'text'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              resolve(false);
            }
          },
          {
            text: 'Submit',
            handler: data => {
              resolve(data.OTP)
            }
          }
        ]
      });
      alert.present();
    })
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
      else {
        this.presentAlert("Error", "Payment made, please contact and inform service provider");
      }
    },
    error => {
      this.loading.dismissAll();
    })
  }

////////////////////////////////////////////////////////////////////////////////

  initiatePayment(){

    if (this.cardno.length == 0 || this.cvv.length == 0 || this.expirymonth.length == 0 || this.expiryyear.length == 0
    || this.email.length == 0 || this.phonenumber.length == 0 || this.firstname.length == 0 || this.lastname.length == 0
    || this.billingaddress.length == 0 || this.billingcity.length == 0 || this.billingcountry.length == 0 || this.billingzip.length == 0){
      this.presentAlert("Error", "Missing details, please fill in all details");
      return;
    }

    this.presentLoading('Please wait ..');



    //payload
    var body = {
      cardno: this.cardno,
      cvv: this.cvv,
      expirymonth: this.expirymonth,
      expiryyear: this.expiryyear,
      currency: this.currency,
      amount: this.amount,
      email: this.email,
      phonenumber: this.phonenumber,
      firstname: this.firstname,
      lastname: this.lastname,
      meta: this.purchaseDetails
    }


    let headers =  new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    let url = this.dataService.raveURL + "initiatePayment";

    this.Http.post(url, JSON.stringify(body), options).map(response => response.json()).subscribe(data => {
      //response
      console.log(data)

      if (data.status == "success"){
        this.loading.dismissAll();

        if (data.data.suggested_auth == "PIN") {
          //display pin popup and collect pin if suggested auth is pin
          this.presentPinPrompt().then( (result) => {
             if (result != false) {
               var body = {
                 cardno: this.cardno,
                 cvv: this.cvv,
                 expirymonth: this.expirymonth,
                 expiryyear: this.expiryyear,
                 currency: this.currency,
                 amount: this.amount,
                 email: this.email,
                 phonenumber: this.phonenumber,
                 firstname: this.firstname,
                 lastname: this.lastname,
                 meta: this.purchaseDetails,
                 pin: result
               }
               this.initiatePaymentPIN(body);
             }
          })
        }

        if (data.data.suggested_auth == "AVS_VBVSECURECODE" || data.data.suggested_auth == "NOAUTH_INTERNATIONAL") {
          var body = {
            cardno: this.cardno,
            cvv: this.cvv,
            expirymonth: this.expirymonth,
            expiryyear: this.expiryyear,
            currency: this.currency,
            amount: this.amount,
            email: this.email,
            phonenumber: this.phonenumber,
            firstname: this.firstname,
            lastname: this.lastname,
            meta: this.purchaseDetails,
            billingzip: this.billingzip,
            billingcity: this.billingcity,
            billingaddress: this.billingaddress,
            billingstate: this.billingstate,
            billingcountry: this.billingcountry,
            suggested_auth: data.data.suggested_auth
          }
          this.initiatePaymentAVS(body);
        }

        if (data.data.chargeResponseCode == "00"){
          this.presentAlert("Success", data.data.chargeResponseMessage);

          this.sendFirstConfirmationEmail(this.paymentEmail);

          if (this.purchaseDetails.type = 'service'){
            this.sendEmailtoServiceProvider(this.serviceProviderEmail)
          }

          data.metadata = this.purchaseDetails
          //save data to the DB
          const promise = this.db.list('/' + 'rave-payments' + '/' + this.user.code + '/' + data.data.tx.id).push(data);
          promise
          .then( (res) => {
            //message successfully sent
            //this.presentToast("Successfully pushed data to the database")
          })
          //.catch(function (err) {
            //some error and the message wasn't sent
            //this.presentToast("Error while pushing data to the database")
          //});
          this.navCtrl.setRoot(InspirationPage);
        }

        if (data.data.chargeResponseCode == "02"){

          if (data.data.authModelUsed.includes("OTP") ){
            this.presentOtpPrompt(data.data.chargeResponseMessage).then( (result) => {
               if (result != false) {
                 var body = {
                   transaction_reference: data.data.flwRef,
                   otp: result
                 }
                 this.verifyPIN(body);
               }
            })
          }

          else if (data.data.authModelUsed == "AVS_VBVSECURECODE" || data.data.authModelUsed == "NOAUTH_INTERNATIONAL" ){
            this.presentToast("Card charge successful, running verification checks");
            let browser = this.iab.create(data.data.authurl, '_system', 'location=yes');
          }
        }
      }

      else if (data.status == "error") {
        this.loading.dismissAll();
        this.presentAlert("Error", data.message);
      }

      else {
        this.loading.dismissAll();
        this.presentAlert("Error", "Unable to make payment, please contact support");
      }
    },
    error => {
      this.loading.dismissAll();
      this.presentAlert("Error", "Unable to make payment, please try again later");
      //this.presentAlert("Error", error);
    })
  }

////////////////////////////////////////////////////////////////////////////////
  initiatePaymentPIN(body){
    this.presentLoading('Please wait ..');
    let headers =  new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    let url = this.dataService.raveURL + "initiatePaymentPIN";

    this.Http.post(url, JSON.stringify(body), options).map(response => response.json()).subscribe(data => {
      console.log(data)
      if (data.status == "success"){
        if (data.data.chargeResponseCode == "02"){
          this.loading.dismissAll();
          this.presentToast("Card charge successful, running verification checks");

          this.presentOtpPrompt(data.data.chargeResponseMessage).then( (result) => {
             if (result != false) {
               var body = {
                 transaction_reference: data.data.flwRef,
                 otp: result
               }
               this.verifyPIN(body);
             }
          })

        }

        else if (data.data.chargeResponseCode == "00"){
          this.presentAlert("Success", data.data.chargeResponseMessage);

          this.sendFirstConfirmationEmail(this.paymentEmail);

          if (this.purchaseDetails.type = 'service'){
            this.sendEmailtoServiceProvider(this.serviceProviderEmail)
          }

          data.metadata = this.purchaseDetails

          //save data to the DB
          const promise = this.db.list('/' + 'rave-payments' + '/' + this.user.code + '/' + data.data.tx.id).push(data);
          promise
          .then( (res) => {
            //message successfully sent
            //this.presentToast("Successfully pushed data to the database")
          })
          //.catch(function (err) {
            //some error and the message wasn't sent
            //this.presentToast("Error while pushing data to the database")
          //});

          this.navCtrl.setRoot(InspirationPage);
        }
      }

      else if (data.status == "error") {
        this.loading.dismissAll();
        this.presentAlert("Error", data.message);
      }

      else {
        this.loading.dismissAll();
        this.presentAlert("Error", "Unable to verify payment, please contact support");
      }
    },
    error => {
      this.loading.dismissAll();
      this.presentAlert("Error", error);
    })
  }

////////////////////////////////////////////////////////////////////////////////
  verifyPIN(body) {
    this.presentLoading('Please wait ..');

    let headers =  new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    let url = this.dataService.raveURL + "validatePayment";

    this.Http.post(url, JSON.stringify(body), options).map(response => response.json()).subscribe(data => {

      console.log(data);

      if ((data.status == "success") && (data.data.data.responsecode == "00")){
        this.loading.dismissAll();
        this.presentAlert("Success", data.data.data.responsemessage);

        this.sendFirstConfirmationEmail(this.paymentEmail);

        if (this.purchaseDetails.type = 'service'){
          this.sendEmailtoServiceProvider(this.serviceProviderEmail)
        }

        data.metadata = this.purchaseDetails;

        //save data to the DB
        const promise = this.db.list('/' + 'rave-payments' + '/' + this.user.code + '/' + data.data.tx.id).push(data);
        promise
        .then( (res) => {
          //message successfully sent
          //this.presentToast("Successfully pushed data to the database")
        })
        //.catch(function (err) {
          //some error and the message wasn't sent
          //this.presentToast("Error while pushing data to the database")
        //});
        //Redirect to home page
        this.navCtrl.setRoot(InspirationPage);
        //Transfer money to service provider, need to have his details before hand
      }
      else if (data.status == "error"){
        this.loading.dismissAll();
        this.presentAlert("Error", data.message);
      }
      else {
        this.loading.dismissAll();
        this.presentAlert("Error", "Unable to validate payment. Reason : " + data.data.data.responsemessage);
        this.navCtrl.pop();
      }

    },
    error => {
      this.loading.dismissAll();
      this.presentAlert("Error", error);
    })
  }

////////////////////////////////////////////////////////////////////////////////

  initiatePaymentAVS(body){
    this.presentLoading('Please wait ..');

    let headers =  new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    let url = this.dataService.raveURL + "initiatePaymentPIN";

    this.Http.post(url, JSON.stringify(body), options).map(response => response.json()).subscribe(data => {
      console.log(data)
      if (data.status == "success" && data.data.chargeResponseCode == "02" ){

        this.loading.dismissAll();

        //load auth URL and finalise
        this.presentToast("Card charge successful, running verification checks");
        const browser = this.iab.create(data.data.authurl, '_system', 'location=yes');

        //browser.on('exit').subscribe(() => {
        //  this.verifyPayment({transaction_reference : data.data.txRef })
        //}, (err) => console.error(err));

      }
      else if (data.status == "error") {
        this.loading.dismissAll();
        this.presentAlert("Error", data.message);
      }
      else {
        this.loading.dismissAll();
        this.presentAlert("Error", "Unable to make payment, please contact support");
      }
    },
    error => {
      this.loading.dismissAll();
      this.presentAlert("Error", error);
    })
  }

}
