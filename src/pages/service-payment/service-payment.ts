import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {DataService} from '../../providers/data-service';
import {UserService} from '../../providers/user-service';
import { PaymentPage } from '../payment/payment';

/**
 * Generated class for the ServicePaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({
  selector: 'page-service-payment',
  templateUrl: 'service-payment.html',
})

export class ServicePaymentPage {
  user:any;
  description : any = "";
  amount : any = "";
  completionDate : any = "";
  address : any = "";
  measurement : any = "";
  size : any;
  sizeCode: any;
  provider: any;
  serviceDetails:any;
  alert: any;
  minDate: any;

  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public userService:UserService, public dataService:DataService) {
    this.user = this.userService.user;
    this.sizeCode = this.user.sizeCode;
    this.provider = this.navParams.get('provider');
    this.minDate = new Date().toISOString();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicePaymentPage');
    this.getSizes();
  }

  getSizes() {
    console.log('getting sizes');
    this.size = this.dataService.sizes.filter(item => item.sizeCode == this.sizeCode)[0];
    this.measurement = 'arm length: ' + this.size.arm_length +
                  ' bust: ' + this.size.bust +
                  ' chest: ' + this.size.chest +
                  ' height: ' + this.size.height +
                  ' high bust: ' + this.size.high_bust +
                  ' hip: ' + this.size.hip +
                  ' inside leg: ' + this.size.inside_leg +
                  ' lower leg: ' + this.size.lower_leg +
                  ' neck: ' + this.size.neck +
                  ' neck to waist: ' + this.size.neck_to_waist +
                  ' shoulder: ' + this.size.shoulder +
                  ' waist: ' + this.size.waist +
                  ' waist to floor: ' + this.size.waist_to_floor +
                  ' weight ' + this.size.weight

    console.log(this.size);
  }

  presentAlert(title,message) {
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Dismiss']
    });
    this.alert.present();
  }

  openPaymentPage(){
    if ( (this.amount.charAt(0) != "N") && (this.amount.charAt(0) != "£") && (this.amount.charAt(0) != "$") && (this.amount.charAt(0) != "€") ){
      this.presentAlert('Error','Invalid price format. Format should be (£15 | $45 | N5000)');
    }

    else if (isNaN(this.amount.substring(1,this.amount.length))){
      this.presentAlert('Error','Invalid price format. Format should be (£15 | $45 | N5000)');
    }

    else if ((this.description.length < 5) ) {
      this.presentAlert('Error','Please provide a description');
    }

    else if ((this.address.length < 5) ) {
      this.presentAlert('Error','Please provide an address');
    }

    else if ((this.completionDate.length == 0) ) {
      this.presentAlert('Error','Please provide a completion date');
    }

    else {
      this.serviceDetails = {
        type : 'service',
        name : this.provider.name,
        email : this.provider.email,
        mobile : this.provider.phone,
        item : this.description,
        itemImage : './assets/images/des1.jpeg',
        completionDate : this.completionDate,
        price : this.amount,
        measurement : this.measurement,
        address : this.address,
        bankAccountHolder : this.provider.bankAccountHolder,
        bankAccountNumber : this.provider.bankAccountNumber,
        bankAccountSortCode : this.provider.bankAccountSortCode,
        status : 'false'
      }


      this.navCtrl.push(PaymentPage,{
        payload:this.serviceDetails,
        view:'service'
      });
    }
  }


}
