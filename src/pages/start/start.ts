import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import {DataService} from '../../providers/data-service';
import {UserService} from '../../providers/user-service';



/**
 * Generated class for the StartPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {


  constructor(public navCtrl: NavController, public navParams: NavParams,public dataService:DataService,public userService:UserService) {
//test if temp node server on or not
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPage');
  }

  start(){
    this.navCtrl.setRoot(LoginPage);

  }


}
