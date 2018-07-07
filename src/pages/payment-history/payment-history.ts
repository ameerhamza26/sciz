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
  stripePaymentHistoryData: object[] = [];
  ravePaymentHistoryData: object[] = [];
  loading:any;
  user:any;
  stripeSubscription;
  raveSubscription;
  segment:any;

  constructor(public platform:Platform, public modalCtrl: ModalController, public userService:UserService, public dataService:DataService, public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase, public loadingCtrl: LoadingController, private alertCtrl: AlertController, public Http: Http) {
    this.segment = 'rave';
    this.presentLoading('Please wait ..');
    this.user = this.userService.user;

    //STRIPE
    this.stripeSubscription = db.list('/' + 'stripe-payments' + '/' + this.user.code, { preserveSnapshot: true });
    this.stripeSubscription.subscribe( data => {
      data.forEach( data => {
        console.log(data.val())

        var formatted_data = Object.keys(data.val()).map(e => data.val()[e])

        console.log(formatted_data[0].created)

        var date = new Date(formatted_data[0].created * 1000);
        formatted_data[0].created = date.toUTCString()

        this.stripePaymentHistoryData.push(formatted_data)
      });
    },
    error => {
      this.loading.dismissAll();
      this.presentAlert("Error", error);
    })

    //RAVE
    this.raveSubscription = db.list('/' + 'rave-payments' + '/' + this.user.code, { preserveSnapshot: true });
    this.raveSubscription.subscribe( data => {
      data.forEach( data => {
        console.log(data.val())

        var formatted_data = Object.keys(data.val()).map(e => data.val()[e])

        var date = new Date(formatted_data[0].data.tx.createdAt);
        formatted_data[0].data.tx.createdAt = date.toUTCString()

        this.ravePaymentHistoryData.push(formatted_data)
      });
      this.loading.dismissAll();
    },
    error => {
      this.loading.dismissAll();
      this.presentAlert("Error", error);
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentHistoryPage');
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

  openStripePayment(paymentDetails) {
    let modal = this.modalCtrl.create(StripeModalContentPage, paymentDetails);
    modal.present();
  }

  openRavePayment(paymentDetails) {
    let modal = this.modalCtrl.create(RaveModalContentPage, paymentDetails);
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
    </ion-card>
  </ion-content>
`
})

export class StripeModalContentPage {
  details;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {

    this.details = this.params.get('paymentDetails');
    console.log(this.details)

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
    </ion-card>
  </ion-content>
`
})

export class RaveModalContentPage {
  details;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {

    this.details = this.params.get('paymentDetails');
    console.log(this.details)

  }



  dismiss() {
    this.viewCtrl.dismiss();
  }
}
