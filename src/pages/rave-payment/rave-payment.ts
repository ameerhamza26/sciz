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
  serviceProviderEmailStore:any;
  serviceProviderEmailService:any;

  raveSubscription;


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

    this.serviceProviderEmailService = {
      provider : this.purchaseDetails.email,
      sender : this.user.name + ' ' + this.user.email,
      item : this.purchaseDetails.item,
      currency : this.currency,
      amount : this.amount,
      dueDate : this.purchaseDetails.completionDate,
      address :this.purchaseDetails.address,
      measurements : this.purchaseDetails.measurement,
    }

    this.serviceProviderEmailStore = {
      provider : this.purchaseDetails.email,
      sender : this.user.name + ' ' + this.user.email,
      item : this.purchaseDetails.item,
      currency : this.currency,
      amount : this.amount,
    }



    //this.amount = this.navParams.get('price');
  }

////////////////////////////////////////////////////////////////////////////////

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
    this.presentPaymentLinkPrompt().then( (result) => {
      if (result != false) {
        const browser = this.iab.create(this.dataService.ravePaymentLinkURL, '_system', 'location=yes');
      }
    })
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
  presentPaymentLinkPrompt() {
    return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create({
        title: 'Payment Link',
        message: 'Proceeding will redirect you out of the app. Ensure the amount paid is the same as the amount for the item being purchased. Add your transaction reference using the external payment link below once payment is complete. Failure to do this may lead to subsequent delays.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              resolve(false);
            }
          },
          {
            text: 'Proceed',
            handler: data => {
              resolve(true);
            }
          }
        ]
      });
      alert.present();
    })
  }


////////////////////////////////////////////////////////////////////////////////
  presentPaymentReferencePrompt() {
    return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create({
        title: 'Transaction Reference',
        message: 'Please enter the transaction reference',
        inputs: [
          {
            name: 'txRef',
            placeholder: 'Transaction Reference',
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
              resolve(data.txRef)
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
        this.loading.dismissAll();
      }
      else {
        this.loading.dismissAll();
        this.presentAlert("Error", "Payment made, please contact and inform service provider");
      }
    },
    error => {
      this.loading.dismissAll();
      this.presentAlert("Error", "Payment made, please contact and inform service provider");
    })
    this.loading.dismissAll();
  }

////////////////////////////////////////////////////////////////////////////////

  sendEmailtoServiceProviderService(body) {
    this.presentLoading('Please wait ..');
    let headers =  new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    let url = this.dataService.raveURL + "sendEmailtoServiceProviderService";

    this.Http.post(url, JSON.stringify(body), options).map(response => response.json()).subscribe(data => {
      console.log(JSON.stringify(data))
      if (data == "success") {
        this.loading.dismissAll();
      }
      else {
        this.loading.dismissAll();
        this.presentAlert("Error", "Payment made, please contact and inform service provider");
      }
    },
    error => {
      this.loading.dismissAll();
    })
    this.loading.dismissAll();
  }

////////////////////////////////////////////////////////////////////////////////

  sendEmailtoServiceProviderStore(body) {
    this.presentLoading('Please wait ..');
    let headers =  new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    let url = this.dataService.raveURL + "sendEmailtoServiceProviderStore";

    this.Http.post(url, JSON.stringify(body), options).map(response => response.json()).subscribe(data => {
      console.log(JSON.stringify(data))
      if (data == "success") {
        this.loading.dismissAll();
      }
      else {
        this.loading.dismissAll();
        this.presentAlert("Error", "Payment made, please contact and inform service provider");
      }
    },
    error => {
      this.loading.dismissAll();
      this.presentAlert("Error", "Payment made, please contact and inform service provider");
    })
    this.loading.dismissAll();
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
/* Disabling all checks for outside the browser
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
*/

        if (data.data.chargeResponseCode == "00"){
          this.presentAlert("Success", data.data.chargeResponseMessage + ' | Once your item has been delivered, please remember to confirm your payment in the payments section of your profile.');


          data.metadata = this.purchaseDetails
          data.externalPayment = 'false';
          //save data to the DB
          const promise = this.db.list('/' + 'rave-payments' + '/' + this.user.code + '/' + data.data.tx.id).push(data);
          promise
          .then( (res) => {
            this.sendFirstConfirmationEmail(this.paymentEmail);

            if (this.purchaseDetails.type == 'service'){
              this.sendEmailtoServiceProviderService(this.serviceProviderEmailService)
            }

            else {
              this.serviceProviderEmailStore.address = this.billingaddress + ', ' + this.billingcity + ', ' + this.billingzip + ', ' + this.billingcountry;
              this.sendEmailtoServiceProviderStore(this.serviceProviderEmailStore)
            }

            //message successfully sent
            //this.presentToast("Successfully pushed data to the database")
          })
          //.catch(function (err) {
            //some error and the message wasn't sent
            //this.presentToast("Error while pushing data to the database")
          //});
          this.navCtrl.setRoot(InspirationPage);
          this.navCtrl.parent.select(0);
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

          //Disabling all broswer related stuff as this would lead to leaving the app
          //else if (data.data.authModelUsed == "AVS_VBVSECURECODE" || data.data.authModelUsed == "NOAUTH_INTERNATIONAL" ){
          //  this.presentToast("Card charge successful, running verification checks");
          //  let browser = this.iab.create(data.data.authurl, '_system', 'location=yes');
          //}
        }
      }

      else if (data.status == "error") {
        this.loading.dismissAll();
        this.presentAlert("Error", data.message);
      }

      else {
        this.loading.dismissAll();
        this.presentAlert("Error", "Unable to make payment, please contact support or try using the payment link instead");
      }
    },
    error => {
      this.loading.dismissAll();
      this.presentAlert("Error", "Unable to make payment, please contact support or try using the payment link instead");
      //this.presentAlert("Error", error);
    })
    this.loading.dismissAll();
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
        this.loading.dismissAll();

        if (data.data.chargeResponseCode == "02"){
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
          this.presentAlert("Success", data.data.chargeResponseMessage + ' | Once your item has been delivered, please remember to confirm your payment in the payments section of your profile.');

          data.metadata = this.purchaseDetails
          data.externalPayment = 'false';

          //save data to the DB
          const promise = this.db.list('/' + 'rave-payments' + '/' + this.user.code + '/' + data.data.tx.id).push(data);
          promise
          .then( (res) => {
            this.sendFirstConfirmationEmail(this.paymentEmail);

            if (this.purchaseDetails.type == 'service'){
              this.sendEmailtoServiceProviderService(this.serviceProviderEmailService)
            }

            else {
              this.serviceProviderEmailStore.address = this.billingaddress + ', ' + this.billingcity + ', ' + this.billingzip + ', ' + this.billingcountry;
              this.sendEmailtoServiceProviderStore(this.serviceProviderEmailStore)
            }


            //message successfully sent
            //this.presentToast("Successfully pushed data to the database")
          })
          //.catch(function (err) {
            //some error and the message wasn't sent
            //this.presentToast("Error while pushing data to the database")
          //});

          this.navCtrl.setRoot(InspirationPage);
          this.navCtrl.parent.select(0);
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
    this.loading.dismissAll();
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
        this.presentAlert("Success", data.data.data.responsemessage + ' | Once your item has been delivered, please remember to confirm your payment in the payments section of your profile.');

        data.metadata = this.purchaseDetails;
        data.externalPayment = 'false';

        //save data to the DB
        const promise = this.db.list('/' + 'rave-payments' + '/' + this.user.code + '/' + data.data.tx.id).push(data);
        promise
        .then( (res) => {
          this.sendFirstConfirmationEmail(this.paymentEmail);

          if (this.purchaseDetails.type == 'service'){
            this.sendEmailtoServiceProviderService(this.serviceProviderEmailService)
          }

          else {
            this.serviceProviderEmailStore.address = this.billingaddress + ', ' + this.billingcity + ', ' + this.billingzip + ', ' + this.billingcountry;
            this.sendEmailtoServiceProviderStore(this.serviceProviderEmailStore)
          }

          //message successfully sent
          //this.presentToast("Successfully pushed data to the database")
        })
        //.catch(function (err) {
          //some error and the message wasn't sent
          //this.presentToast("Error while pushing data to the database")
        //});
        //Redirect to home page
        this.navCtrl.setRoot(InspirationPage);
        this.navCtrl.parent.select(0);
        //Transfer money to service provider, need to have his details before hand
      }
      else if (data.status == "error"){
        this.loading.dismissAll();
        this.presentAlert("Error", data.message);
      }
      else {
        this.loading.dismissAll();
        this.presentAlert("Error", "Unable to validate payment. Reason : " + data.data.data.responsemessage);
      }

    },
    error => {
      this.loading.dismissAll();
      this.presentAlert("Error", error);
    })
    this.loading.dismissAll();
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
    this.loading.dismissAll();
  }

////////////////////////////////////////////////////////////////////////////////

  addExternalPayment(){

    if (this.email.length == 0 || this.firstname.length == 0 || this.lastname.length == 0
    || this.billingaddress.length == 0 || this.billingcity.length == 0 || this.billingcountry.length == 0 || this.billingzip.length == 0){
      this.presentAlert("Error", "Email, Address, City, Zip/Postal Code, Country, First Name, Last Name are all required. You will not be charged.");
      return;
    }


    this.presentPaymentReferencePrompt().then( (result) => {
       if (result != false) {
         this.checkReferenceAndUpdateDb(result);
       }
    })

  }

////////////////////////////////////////////////////////////////////////////////
  checkDuplicateReference(id){
    //RAVE
    return new Promise((resolve, reject) => {
      var duplicate = 'false'

      this.raveSubscription = this.db.list('/' + 'rave-payments' + '/' + this.user.code, { preserveSnapshot: true });
      this.raveSubscription.subscribe( ravedata => {

        for (let data of ravedata){
          if (data.key == id){
            console.log(data.key)
            duplicate = 'true'
          }
        }
      })

      if (duplicate == 'true'){
        resolve(true)
      }
      else {
        resolve(false)
      }
    })
  }

////////////////////////////////////////////////////////////////////////////////

  checkReferenceAndUpdateDb(txRef){
    this.presentLoading('Please wait ..');

    let headers =  new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    let url = this.dataService.raveURL + "listTransactions";

    var body = {
      status: "successful",
      customer_email : this.email,
      transaction_reference : txRef
    }

    this.Http.post(url, JSON.stringify(body), options).map(response => response.json()).subscribe(data => {

      console.log(data);

      if ((data.status == "success") && (data.data.page_info.total == 1)){
        this.loading.dismissAll();

        this.checkDuplicateReference(data.data.transactions[0].id).then( (result) => {
          console.log(result)

          if (data.data.transactions[0].amount != this.amount || data.data.transactions[0].currency.toUpperCase() != this.currency.toUpperCase()){
            this.presentAlert("Error", "Payment amounts or currency do not match");
          }

           else if (result == true) {

             this.presentAlert("Error", "Payment already added for the given transaction reference");
           }

           else {
             this.presentAlert("Success", 'Transaction Verified | Once your item has been delivered, please remember to confirm your payment in the payments section of your profile.');

             data.metadata = this.purchaseDetails;
             data.externalPayment = 'true';

             //save data to the DB
             const promise = this.db.list('/' + 'rave-payments' + '/' + this.user.code + '/' + data.data.transactions[0].id).push(data);
             promise
             .then( (res) => {
               this.sendFirstConfirmationEmail(this.paymentEmail)


               if (this.purchaseDetails.type == 'service'){
                 this.sendEmailtoServiceProviderService(this.serviceProviderEmailService)
               }

               else {
                 this.serviceProviderEmailStore.address = this.billingaddress + ', ' + this.billingcity + ', ' + this.billingzip + ', ' + this.billingcountry;
                 this.sendEmailtoServiceProviderStore(this.serviceProviderEmailStore)
               }

               //message successfully sent
               //this.presentToast("Successfully pushed data to the database")
             })
             //.catch(function (err) {
               //some error and the message wasn't sent
               //this.presentToast("Error while pushing data to the database")
             //});
             //Redirect to home page
             this.navCtrl.setRoot(InspirationPage);
             this.navCtrl.parent.select(0);
             //Transfer money to service provider, need to have his details before hand
           }
        },
        error => {
          this.loading.dismissAll();
          this.presentAlert("Error", error);
        })
      }

      else if ((data.status == "success") && (data.data.page_info.total == 0)){
        this.loading.dismissAll();
        this.presentAlert("Error", "Unable to find payment for the given transaction reference, ensure email is the same that was used during payment");
      }

      else if (data.status == "error"){
        this.loading.dismissAll();
        this.presentAlert("Error", data.message);
      }
      else {
        this.loading.dismissAll();
        this.presentAlert("Error", "Unable to verify payment, please try again later");
      }

    },
    error => {
      this.loading.dismissAll();
      this.presentAlert("Error", error);
    })
    this.loading.dismissAll();

  }

}
