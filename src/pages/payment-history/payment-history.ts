import { Component } from '@angular/core';
import { ModalController, ViewController, IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';

import {DataService} from '../../providers/data-service';
import {UserService} from '../../providers/user-service';

/**
 * Generated class for the PaymentHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-history',
  templateUrl: 'payment-history.html',
})
export class PaymentHistoryPage {
  listofPayments = new Map<string, object []>();
  stripePaymentHistoryData = [];
  ravePaymentHistoryData = [];
  stripeSubscription;
  raveSubscription;
  loading:any;
  user:any;
  segment:any;

  constructor(public platform:Platform, public modalCtrl: ModalController, public userService:UserService, public dataService:DataService, public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase, public loadingCtrl: LoadingController, private alertCtrl: AlertController, public Http: Http) {
    this.segment = 'rave';
    this.presentLoading('Please wait ..');
    this.user = this.userService.user;
  }

  ionViewDidLoad() {
    this.listofPayments = new Map<string, object []>();
    this.stripePaymentHistoryData = [];
    this.ravePaymentHistoryData = [];

    //STRIPE
    this.stripeSubscription = this.db.list('/' + 'stripe-payments' + '/' + this.user.code, { preserveSnapshot: true });
    this.stripeSubscription.subscribe( data => {
      data.forEach( data => {

        var formatted_data = Object.keys(data.val()).map(e => data.val()[e])
        var date = new Date(formatted_data[0].created * 1000);

        formatted_data[0].created = date.toUTCString()
        formatted_data[0].key = Object.keys(data.val())[0]
        formatted_data[0].id = data.key

        this.stripePaymentHistoryData.push(formatted_data)
      });
    },
    error => {
      this.loading.dismissAll();
      this.presentAlert("Error", error);
    })

    //RAVE
    this.raveSubscription = this.db.list('/' + 'rave-payments' + '/' + this.user.code, { preserveSnapshot: true });
    this.raveSubscription.subscribe( data => {
      data.forEach( data => {

        var formatted_data = Object.keys(data.val()).map(e => data.val()[e])
        var date = new Date(formatted_data[0].data.tx.createdAt);

        formatted_data[0].data.tx.createdAt = date.toUTCString()
        formatted_data[0].key = Object.keys(data.val())[0]
        formatted_data[0].id = data.key

        this.ravePaymentHistoryData.push(formatted_data)
      });
      this.loading.dismissAll();
    },
    error => {
      this.loading.dismissAll();
      this.presentAlert("Error", error);
    })

    console.log('ionViewDidLoad PaymentHistoryPage');
  }

  presentLoading(message) {
    this.loading = this.loadingCtrl.create({
      content: message
    });

    this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
    }, 2500);
  }

  presentAlert(title, message) {
  let alert = this.alertCtrl.create({
    title: title,
    subTitle: message,
    buttons: ['Dismiss']
  });
  alert.present();
  }

  openStripePayment(paymentDetails) {
    let modal = this.modalCtrl.create(StripeModalContentPage, paymentDetails);
    modal.onDidDismiss(() => {
      this.ionViewDidLoad();
    });
    modal.present();
  }

  openRavePayment(paymentDetails) {
    let modal = this.modalCtrl.create(RaveModalContentPage, paymentDetails);
    modal.onDidDismiss(() => {
      this.ionViewDidLoad();
    });
    modal.present();
  }


}

@Component({
  template: `
  <ion-header>
    <ion-toolbar color="black">
      <ion-buttons start>
        <button ion-button (click)="dismiss()">
          <span ion-text color="main" showWhen="ios">Close</span>
          <ion-icon name="close" color="main" showWhen="android,windows"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content style="background-color:black;">
    <ion-card padding>
      <img src={{details[0].metadata.itemImage}} width="300px" height="300px"/>
      <ion-card-content>
        <ion-card-title>
          {{details[0].metadata.item}}
        </ion-card-title>
        <h2>Amount Paid</h2>
        <p>{{details[0].amount/100}} {{details[0].currency.toUpperCase()}}</p>
        <h2>Purchased From</h2>
        <p>{{details[0].metadata.name}} - {{details[0].metadata.email}}</p>
        <h2>Payment Date</h2>
        <p>{{details[0].created}}</p>
        <h2>Transaction Reference</h2>
        <p>{{details[0].balance_transaction}}</p>
      </ion-card-content>

      <h2 *ngIf="details[0].metadata.status=='true';"><b>Payment already confirmed.</b></h2>
      <p *ngIf="details[0].metadata.status=='false';"><b>Only confirm a payment once you are satisfied with your purchase. This action cannot be undone.</b></p>
      <button *ngIf="details[0].metadata.status=='false';" ion-button button full color="secondary" (click)="sendFinalConfirmationEmail(details[0])">Confirm Payment</button>
    </ion-card>
  </ion-content>
`
})

export class StripeModalContentPage {
  details;
  user;
  loading;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public dataService: DataService,
    public Http: Http,
    public db: AngularFireDatabase,
    public userService:UserService,
    public alertCtrl: AlertController) {

    this.details = this.params.get('paymentDetails');
    this.user = this.userService.user;

    console.log(this.details)
    console.log(this.user)
  }

  presentLoading(message) {
    this.loading = this.loadingCtrl.create({
      content: message
    });

    this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
    }, 5000);
  }

  presentAlert(title, message) {
  let alert = this.alertCtrl.create({
    title: title,
    subTitle: message,
    buttons: ['Dismiss']
  });
  alert.present();
  }

  sendFinalConfirmationEmail(details) {

    var body = {
      sender : this.user.name + ' ' + this.user.email,
      provider : details.metadata.name + ' ' + details.metadata.email,
      item : details.metadata.item,
      currency : details.currency.toUpperCase(),
      amount :details.amount/100,
      bankAccountHolder : details.bankAccountHolder,
      bankAccountNumber : details.bankAccountNumber,
      bankAccountSortCode : details.bankAccountSortCode
    }

    var paymentId = '' + details.id;
    var paymentKey = '' + details.key;
    var userCode = '' + this.user.code;

    this.presentLoading('Please wait ..');
    let headers =  new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    let url = this.dataService.raveURL + "sendFinalConfirmationEmail";

    this.Http.post(url, JSON.stringify(body), options).map(response => response.json()).subscribe(data => {
      console.log(JSON.stringify(data))
      if (data == "success") {
        this.db.list('/' + 'stripe-payments' + '/' + userCode + '/' + paymentId + '/' + paymentKey).update('metadata', {status : 'true'})
        this.navCtrl.pop();
      }
    },
    error => {
      this.presentAlert("Error", "Payment made, please contact and inform service provider");
      this.loading.dismissAll();
    })
  }



  dismiss() {
    this.viewCtrl.dismiss();
  }
}


@Component({
  template: `
  <ion-header>
    <ion-toolbar color="black">
      <ion-buttons start>
        <button ion-button (click)="dismiss()">
          <span ion-text color="main" showWhen="ios">Close</span>
          <ion-icon name="close" color="main" showWhen="android,windows"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content style="background-color:black;">
    <ion-card padding>
      <img src={{details[0].metadata.itemImage}} width="300px" height="300px"/>
      <ion-card-content>
        <ion-card-title>
          {{details[0].metadata.item}}
        </ion-card-title>
        <h2>Amount Paid</h2>
        <p>{{details[0].data.tx.amount}} {{details[0].data.tx.currency.toUpperCase()}}</p>
        <h2>Purchased From</h2>
        <p>{{details[0].metadata.name}} - {{details[0].metadata.email}}</p>
        <h2>Payment Date</h2>
        <p>{{details[0].data.tx.createdAt}}</p>
        <h2>Transaction Reference</h2>
        <p>{{details[0].data.tx.txRef}}</p>
      </ion-card-content>

      <h2 *ngIf="details[0].metadata.status=='true';"><b>Payment already confirmed.</b></h2>
      <p *ngIf="details[0].metadata.status=='false';"><b>Only confirm a payment once you are satisfied with your purchase. This action cannot be undone.</b></p>
      <button *ngIf="details[0].metadata.status=='false';" ion-button button full color="secondary" (click)="sendFinalConfirmationEmail(details[0])">Confirm Payment</button>

    </ion-card>
  </ion-content>
`
})

export class RaveModalContentPage {
  details;
  user;
  loading;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public dataService: DataService,
    public Http: Http,
    public db: AngularFireDatabase,
    public userService:UserService,
    public alertCtrl: AlertController) {

    this.details = this.params.get('paymentDetails');
    this.user = this.userService.user;

  }

  presentLoading(message) {
    this.loading = this.loadingCtrl.create({
      content: message
    });

    this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
    }, 5000);
  }

  presentAlert(title, message) {
  let alert = this.alertCtrl.create({
    title: title,
    subTitle: message,
    buttons: ['Dismiss']
  });
  alert.present();
  }

  sendFinalConfirmationEmail(details) {

    var body = {
      sender : this.user.name + ' ' + this.user.email,
      provider : details.metadata.name + ' ' + details.metadata.email,
      amount : details.data.tx.amount,
      item : details.metadata.item,
      currency : details.data.tx.currency.toUpperCase(),
      bankAccountHolder : details.bankAccountHolder,
      bankAccountNumber : details.bankAccountNumber,
      bankAccountSortCode : details.bankAccountSortCode
    }

    var paymentId = '' + details.id;
    var paymentKey = '' + details.key;
    var userCode = '' + this.user.code;

    this.presentLoading('Please wait ..');
    let headers =  new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    let url = this.dataService.raveURL + "sendFinalConfirmationEmail";

    this.Http.post(url, JSON.stringify(body), options).map(response => response.json()).subscribe(data => {
      if (data == "success") {
        this.db.list('/' + 'rave-payments' + '/' + userCode + '/' + paymentId + '/' + 'metadata').update(paymentKey, {status : 'true'})
        this.navCtrl.pop();
      }
    },
    error => {
      this.presentAlert("Error", "Payment made, please contact and inform service provider");
      this.loading.dismissAll();
    })
  }



  dismiss() {
    this.viewCtrl.dismiss();
  }
}
