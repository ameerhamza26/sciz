import { Component } from '@angular/core';
import {NavController, NavParams, LoadingController, Platform} from 'ionic-angular';
import { SignUpPage } from '../sign-up/sign-up';
import { TabsPage } from '../tabs/tabs';
import { Md5 } from 'ts-md5/dist/md5';
import { AlertController } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { UserService } from '../../providers/user-service';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../app/auth.service'
import {ErrorHandlerProvider} from "../../providers/error-handler/error-handler";
import {InspirationPage} from "../inspiration/inspiration";
import {ProfilePage} from "../profile/profile";
import {ScizzorPage} from "../scizzor/scizzor";

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 *
 * login() get username ,password and send to server for verification
 * signUp() segue sign up  page
 * showAlert(title,message)
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loading: any;
  username: any = "";
  password: any = "";
  permission: any;
    Branch;
    branchUniversalObj;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private errorHandlerProvider: ErrorHandlerProvider, public dataService: DataService, public userService: UserService, private storage: Storage,platform: Platform, public auth: AuthService) {
      const branchInit = () => {
          console.log("Branch init");
          // only on devices
          if (!platform.is("cordova")) {
              return;
          }
          const Branch = window["Branch"];
          this.branchUniversalObj = null;

          Branch.initSession().then(data => {
              if (data["+clicked_branch_link"]) {
                  console.log("BRANCH LINK DATA");
                  console.log(JSON.stringify(data));
                  console.log(data);
                this.storage.set("branchLink",data);
                  // read deep link data on click


                  //alert("Deep Link Data: " + JSON.stringify(data));
              }
          });
      };
      branchInit();
  }

  ionViewDidLoad() {
    console.log('user stor',this.storage.get('user'));
  }

  signInAnonymously() {
    this.auth.anonymousLogin();
  }

  login() {
    if ((this.password.length > 6 && this.username.length > 3) || this.username == 'admin') {
      this.showLoading('Logging In...');
      let hash = Md5.hashStr(this.password);
      this.dataService.login(this.username, hash).subscribe(data => {
        try {
          this.loading.dismissAll();
          if (data.message == "Successful" && (data.result[0].type == "customer" || data.result[0].type == "service" || data.result[0].type == "admin")) {
            this.setUser(data.result[0]);
            this.signInAnonymously();
            this.storage.set('data', data);
            //this.dataService.getLikes();
            console.log(this.dataService.me);
            // if (data.result[0].type == "customer") {
            //   this.dataService.getSizeFile();
            // } else if (data.result[0].type == "admin" || this.dataService.me.type2 == 'Illustrator') {
            //   this.dataService.loadIllustratorPosts();
            // }
            this.navCtrl.setRoot(TabsPage);
          } else {
              console.log("ERR 5");

              this.errorHandlerProvider.throwWarning(ErrorHandlerProvider.MESSAGES.warning.login[0].title, ErrorHandlerProvider.MESSAGES.warning.login[0].msg);
          }
        } catch (error) {
            console.log(error);
            console.log("ERR 4");

            this.errorHandlerProvider.throwError(ErrorHandlerProvider.MESSAGES.serviceStatus.login[0].title, ErrorHandlerProvider.MESSAGES.serviceStatus.login[0].msg);
        }
      },
      err => {
        console.log("ERR 1");
        this.loading.dismissAll();
        this.errorHandlerProvider.throwError(ErrorHandlerProvider.MESSAGES.serviceStatus.login[0].title, ErrorHandlerProvider.MESSAGES.serviceStatus.login[0].msg);
      });
    }
    else if ((this.password.length < 6) || (this.username.length < 3)) {
        console.log("ERR 2");

        this.errorHandlerProvider.throwValideWarning(ErrorHandlerProvider.MESSAGES.validation.login[0].title, ErrorHandlerProvider.MESSAGES.validation.login[0].msg);
    }

    else {
        console.log("ERR 3");

        this.errorHandlerProvider.throwError(ErrorHandlerProvider.MESSAGES.serviceStatus.login[0].title, ErrorHandlerProvider.MESSAGES.serviceStatus.login[0].msg);
    }
  }

  setUser(user) {
    console.log("SET USER");
    console.log(user);
    this.storage.set('user', user);
    // let newUser = new User('0','testCode',this.permission,'Manufacturer','','images/profile.jpg','Delz','scizzorapp@gmail.com','Auckland','02105976881',true,'short description','@username','@username','@username','http://www.sczr.co.uk','sizeCode',3,'hashTest');
    this.userService.setUser(user);
    // this.dataService.users.push(newUser);
    this.dataService.permission = this.userService.getPermission(user);
    this.dataService.me = user;
  }

  signUp() {
    console.log('Sign Up');
    this.navCtrl.setRoot(SignUpPage);
  }

  showLoading(message) {

    this.loading = this.loadingCtrl.create({
      content: message
    });
    this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
    }, 10000);


  }
}
