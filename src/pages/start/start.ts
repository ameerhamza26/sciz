import { Component } from '@angular/core';
import {AlertController, NavController, NavParams, Platform} from 'ionic-angular';
import { LoginPage } from '../login/login';
import {DataService} from '../../providers/data-service';
import {UserService} from '../../providers/user-service';
import {InspirationPage} from "../inspiration/inspiration";
import {ProfilePage} from "../profile/profile";
import {ScizzorPage} from "../scizzor/scizzor";



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
  constructor(platform: Platform,public navCtrl: NavController, public navParams: NavParams,public dataService:DataService,public userService:UserService,private alertCtrl: AlertController) {
//test if temp node server on or not
      const branchInit = () => {
          console.log("Branch init");
          // only on devices
          if (!platform.is("cordova")) {
              return;
          }
          const Branch = window["Branch"];
          this.branchUniversalObj = null;

          Branch.initSession().then(data => {
              /*  Branch.createBranchUniversalObject(properties).then((res)=>{
                    console.log("Create Universal object");
                    this.branchUniversalObj = res;
                    this.generateShortLink();
                }); */
              if (data["+clicked_branch_link"]) {
                  console.log(JSON.stringify(data));
                  if(this.dataService.me){
                      switch (data.type){
                          case 'Profile':
                              var profile =  this.dataService.users.filter(item => item.code == data.code)[0];
                              this.navCtrl.push(ProfilePage,{
                                  userCode:profile.code,
                                  view:'service'
                              });
                              break;
                          case 'Magazine':
                              var post = this.dataService.posts.filter(item=>item.code == data.code)[0];
                              this.navCtrl.push(InspirationPage,{
                                  post:post,
                                  is_deeplink:true
                              });
                              break;
                          case 'Item':
                              var item = this.dataService.creations.filter(item => item.code == data.code)[0];
                              this.navCtrl.push(ScizzorPage,{
                                  creation:item,
                                  is_deeplink:true
                              });
                              break;
                          default:
                              this.presentAlert("Deeplink","No matching links");
                              break;
                      }
                  }
                  // read deep link data on click


                  //alert("Deep Link Data: " + JSON.stringify(data));
              }

          });
      };
      branchInit();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPage');

  }
    presentAlert(title,message) {
        this.alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['Dismiss']
        });
        this.alert.present();
    }
  start(){
    this.navCtrl.setRoot(LoginPage);

  }


}
