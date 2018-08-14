import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AuthService } from './auth.service';
import { Camera } from '@ionic-native/camera';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { EmailComposer } from '@ionic-native/email-composer';
//import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Stripe } from '@ionic-native/stripe';

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
import { ScizzorSearchPageModule } from '../pages/scizzor-search/scizzor-search.module';
import { TagPageModule } from '../pages/tag/tag.module';
import { PaymentPageModule } from '../pages/payment/payment.module';
import { RavePaymentPageModule } from '../pages/rave-payment/rave-payment.module';
import { StripePaymentPageModule } from '../pages/stripe-payment/stripe-payment.module';
import { PaymentHistoryPageModule } from '../pages/payment-history/payment-history.module';
import { StripeModalContentPage } from '../pages/payment-history/payment-history';
import { RaveModalContentPage } from '../pages/payment-history/payment-history';
import { ServicePaymentPageModule } from '../pages/service-payment/service-payment.module';

//import { IonicImageLoader } from 'ionic-image-loader';
import { FCM } from '@ionic-native/fcm';

import { NativePageTransitions } from '@ionic-native/native-page-transitions';



import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataService } from '../providers/data-service';
import { AppSettings } from '../providers/app-settings'
import { FcmProvider } from '../providers/fcm/fcm';
import { HttpModule } from '@angular/http';
import { AudioService } from '../providers/audio-service';

import { NativeAudio } from '@ionic-native/native-audio';
import { UserService } from '../providers/user-service';

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
    //ScizzorSearchPage,
    //TagPage,
    //PaymentPage,
    //RavePaymentPage,
    //StripePaymentPage,
    ModalContentPage,
    //PaymentHistoryPage,
    StripeModalContentPage,
    RaveModalContentPage,
    //ServicePaymentPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    //    IonicImageLoader.forRoot(),
    IonicStorageModule.forRoot(),
    PaymentPageModule,
    ScizzorSearchPageModule,
    TagPageModule,
    PaymentPageModule,
    RavePaymentPageModule,
    StripePaymentPageModule,
    PaymentHistoryPageModule,
    ServicePaymentPageModule
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
    //ScizzorSearchPage,
    //TagPage,
    //PaymentPage,
    //RavePaymentPage,
    //StripePaymentPage,
    ModalContentPage,
    //PaymentHistoryPage,
    StripeModalContentPage,
    RaveModalContentPage,
    //ServicePaymentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DataService, AppSettings, NativePageTransitions, Camera,
    AudioService, NativeAudio, AuthService,
    UserService, EmailComposer, InAppBrowser, Stripe, FCM, FcmProvider
  ]
})
export class AppModule { }
