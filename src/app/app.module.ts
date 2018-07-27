import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Camera } from '@ionic-native/camera';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { EmailComposer } from '@ionic-native/email-composer';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { IonicStorageModule } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';


import { TabsPage } from '../pages/tabs/tabs';
import { StartPage } from '../pages/start/start';
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { InspirationPage } from '../pages/inspiration/inspiration';
import { LookbookPage } from '../pages/lookbook/lookbook';
import { LookbookLeroyPage } from '../pages/lookbook-leroy/lookbook-leroy';
import { LookbookFlipPage } from '../pages/lookbook-flip/lookbook-flip';
import { CreateNewPage } from '../pages/create-new/create-new';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { CreationPage } from '../pages/creation/creation';
import { ProfilePage } from '../pages/profile/profile';
import { ScizzorPage } from '../pages/scizzor/scizzor';
import { MessengerPage } from '../pages/messenger/messenger';
import { ChatPage } from '../pages/chat/chat';
import { ModalContentPage } from '../pages/chat/chat';
import { ScizzorSearchPage } from '../pages/scizzor-search/scizzor-search';
import { TagPage } from '../pages/tag/tag';

//import { IonicImageLoader } from 'ionic-image-loader';

import { NativePageTransitions } from '@ionic-native/native-page-transitions';



import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataService } from '../providers/data-service';
import { AppSettings } from '../providers/app-settings'
import { HttpModule } from '@angular/http';
import { AudioService } from '../providers/audio-service';

import { NativeAudio } from '@ionic-native/native-audio';
import { UserService } from '../providers/user-service';
import { SocialShareProvider } from '../providers/social-share/social-share';

import { VerticalLookbook } from '../components/vertical-lookbook/vertical-lookbook';
import { HorizontalLookbook } from '../components/horizontal-lookbook/horizontal-lookbook';


var config = {
  apiKey: "AIzaSyBx7oLWNN8sP9NgcRyfppT0VyPnTxLg0nk",
  authDomain: "scizzor-14968.firebaseapp.com",
  databaseURL: "https://scizzor-14968.firebaseio.com",
  projectId: "scizzor-14968",
  storageBucket: "scizzor-14968.appspot.com",
  messagingSenderId: "965202261185"
};


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    StartPage,
    LoginPage,
    SignUpPage,
    InspirationPage,
    LookbookPage,
    LookbookLeroyPage,
    LookbookFlipPage,
    CreateNewPage,
    UserProfilePage,
    CreationPage,
    ProfilePage,
    ScizzorPage,
    VerticalLookbook,
    HorizontalLookbook,
    MessengerPage,
    ChatPage,
    ScizzorSearchPage,
    TagPage,
    ModalContentPage





  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    //    IonicImageLoader.forRoot(),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    StartPage,
    LoginPage,
    SignUpPage,
    InspirationPage,
    LookbookPage,
    LookbookLeroyPage,
    LookbookFlipPage,
    CreateNewPage,
    UserProfilePage,
    CreationPage,
    ProfilePage,
    ScizzorPage,
    MessengerPage,
    ChatPage,
    ScizzorSearchPage,
    TagPage,
    ModalContentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DataService, AppSettings, NativePageTransitions, Camera,
    SocialSharing, AudioService, NativeAudio,
    UserService, EmailComposer, Push,
    SocialShareProvider
  ]
})
export class AppModule { }
