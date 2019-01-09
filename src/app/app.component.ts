import { Component } from '@angular/core';
import {AlertController, NavController, Platform, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataService } from '../providers/data-service';
import { UserService } from '../providers/user-service';
import { StartPage } from '../pages/start/start';
import { TabsPage } from '../pages/tabs/tabs'
import { Storage } from '@ionic/storage';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { FCM } from '@ionic-native/fcm';
import { FcmProvider } from '../providers/fcm/fcm';
import {Keyboard} from '@ionic-native/keyboard';

/*
// optional fields

var analytics = {
channel: "facebook",
feature: "onboarding",
campaign: "content 123 launch",
stage: "new user",
tags: ["one", "two", "three"]
};

// optional fields

var properties = {
$desktop_url: "http://www.example.com/desktop",
$android_url: "http://www.example.com/android",
$ios_url: "http://www.example.com/ios",
$ipad_url: "http://www.example.com/ipad",
$deeplink_path: "content/123",
$match_duration: 2000,
custom_string: "data",
custom_integer: Date.now(),
custom_boolean: true
};

*/

var analytics = {
  channel: 'facebook',
  feature: 'onboarding',
  campaign: 'content 123 launch',
  stage: 'new user',
  tags: ['one', 'two', 'three']
}

// optional fields
var properties = {
  $desktop_url: 'http://www.example.com/desktop',
  $android_url: 'http://www.example.com/android',
  $ios_url: 'http://www.example.com/ios',
  $ipad_url: 'http://www.example.com/ipad',
  $match_duration: 2000,
  custom_string: 'data',
  custom_integer: Date.now(),
  custom_boolean: true
}

var message = "Check out this link";

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage:any = StartPage;
  username: any = "";
  Branch;
  branchUniversalObj;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public dataService: DataService, public userService: UserService, private storage: Storage,private alertCtrl: AlertController, fcmprovider: FcmProvider, private fcm: FCM, afAuth: AngularFireAuth, private toastCtrl: ToastController, keyboard: Keyboard) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      keyboard.hideFormAccessoryBar(false);

      // Authenticate in firebase for chat functionality
      afAuth.authState.subscribe(auth => {
        if(auth) {
          console.log('logged in firebase');

          // get the device token and save to db for push notifications
          if (platform.is('ios') || platform.is('android')) {
            fcm.getToken().then(token=>{
              fcmprovider.saveToken(this.dataService.me.code, token);
            })

            fcm.onNotification().subscribe(data=>{
              if(data.wasTapped){
                console.log("Received in background");
              } else {
                this.presentToast(data.aps.alert.title + ": " + data.aps.alert.body)
                console.log("Received in foreground");
                console.log(data);
              };
            })

            fcm.onTokenRefresh().subscribe(token=>{
              // save to db
              fcmprovider.saveToken(this.dataService.me.code, token);
            });
          }

        } else {
          console.log('not logged in firebase');
          this.rootPage = StartPage
        }
      });

      platform.resume.subscribe(() => {
        console.log("Hi resume");
      });

      // Get session of Logged in user
      storage.get('data').then((data) => {
        if (data) {
          storage.get('user').then(u_name => {
            this.setUser(data);


            this.rootPage = TabsPage
          })
        }
        else {
          this.rootPage = StartPage;
        }
      });
    });
  }

  /*
  * SET USER DETAILS AND PERMISSIONS */
  setUser(userName) {
    let user = userName.result[0];
    this.userService.setUser(user);
    this.dataService.permission = this.userService.getPermission(user);
    this.dataService.me = user;
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

}
