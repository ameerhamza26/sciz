import { Component } from '@angular/core';
import {AlertController, NavController, NavParams, Platform} from 'ionic-angular';
import { LoginPage } from '../login/login';
import {DataService} from '../../providers/data-service';
import {UserService} from '../../providers/user-service';
import {InspirationPage} from "../inspiration/inspiration";
import {ProfilePage} from "../profile/profile";
import {ScizzorPage} from "../scizzor/scizzor";
import {ErrorHandlerProvider} from "../../providers/error-handler/error-handler";
import {Storage} from "@ionic/storage";



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
    alert:any;
    Branch;
    branchUniversalObj;
  constructor(private platform: Platform,public navCtrl: NavController, public navParams: NavParams,public dataService:DataService,public userService:UserService,private erroHandler: ErrorHandlerProvider,private storage: Storage) {

      const branchInit = () => {
          console.log("Branch init");
          // only on devices
          if (!this.platform.is("cordova")) {
              return;
          }
          const Branch = window["Branch"];
          this.branchUniversalObj = null;
          if (Branch != undefined) {
            Branch.initSession().then(data => {
                if (data["+clicked_branch_link"]) {
                    console.log(data);
                    this.storage.set("branchItem",data);
                }
            });
          }

      };

      branchInit(); // Initial branch init required when app is first starting
  }

    ionViewDidEnter() {
    console.log('ionViewDidLoad StartPage');


  }

  start(){
    this.navCtrl.setRoot(LoginPage);

  }


}
