import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService:UserService, public dataService:DataService) {
    this.user = this.userService.user;
    this.sizeCode = this.user.sizeCode;
    this.provider = this.navParams.get('provider');
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

  openPaymentPage(){
    this.serviceDetails = {
      type : 'service',
      name : this.provider.name,
      email : this.provider.email,
      mobile : this.provider.phone,
      item : this.description,
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
