import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataService } from '../providers/data-service';
import { UserService } from '../providers/user-service';

import { StartPage } from '../pages/start/start';
import { TabsPage } from '../pages/tabs/tabs'
import { Storage } from '@ionic/storage';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  username: any = "";
  // rootPage:any = TabsPage;

  constructor(afAuth: AngularFireAuth, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public dataService: DataService, public userService: UserService, private storage: Storage) {

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

      /* Get Session of Logedin user */
      storage.get('data').then((data) => {
        if (data) {
          storage.get('user').then(u_name => {
            this.setUser(u_name);
            this.dataService.getLikes();
            console.log(this.dataService.me);
            if (data.result[0].type == "customer") {
              this.dataService.getSizeFile();
            } else if (data.result[0].type == "admin" || this.dataService.me.type2 == 'Illustrator') {
              this.dataService.loadIllustratorPosts();
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
    let user = userName;
    this.userService.setUser(user);
    this.dataService.permission = this.userService.getPermission(user);
    this.dataService.me = user;
  }
}
