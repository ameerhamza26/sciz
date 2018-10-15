import { Component } from '@angular/core';
import {AlertController, NavController, Platform} from 'ionic-angular';
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


// optional fields
/*var analytics = {
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
  // rootPage:any = TabsPage;
   Branch;
    branchUniversalObj;
   constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public dataService: DataService, public userService: UserService, private storage: Storage,private alertCtrl: AlertController, fcmprovider: FcmProvider, private fcm: FCM, afAuth: AngularFireAuth) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      afAuth.authState.subscribe(auth => {
          if(auth) {
            console.log('logged in firebase');
          } else {
            console.log('not logged in firebase');
            this.rootPage = StartPage
          }
        });

        platform.resume.subscribe(() => {
                console.log("HI resume");
        });

      /* Get Session of Logedin user */
      storage.get('data').then((data) => {
        if (data) {
          storage.get('user').then(u_name => {
            this.setUser(data);
            //this.dataService.getLikes();
            //fcmprovider.saveToken('TestToken');
            if (data.result[0].type == "customer") {
              this.dataService.getSizeFile();
            } else if (data.result[0].type == "admin" || this.dataService.me.type2 == 'Illustrator') {
              this.dataService.loadIllustratorPosts();
            }

            if (platform.is('cordova')) {
              fcm.getToken().then(token=>{
                // save to db
                fcmprovider.saveToken(this.dataService.me.code, token);
              })

              fcm.onNotification().subscribe(data=>{
                if(data.wasTapped){
                  console.log("Received in background");
                } else {
                  console.log("Received in foreground");
                };
              })

              fcm.onTokenRefresh().subscribe(token=>{
                //save to db
                fcmprovider.saveToken(this.dataService.me.code, token);
              });
            }

            this.rootPage = TabsPage
          })
        }
        else {
          this.rootPage = StartPage;
        }
      });


    });



  }

  setUser(userName) {
    /* Set User Detail and Permission */
    let user = userName.result[0];
    this.userService.setUser(user);
    this.dataService.permission = this.userService.getPermission(user);
    this.dataService.me = user;
  }


}
