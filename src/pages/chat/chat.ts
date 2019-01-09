import { Component, ViewChild } from '@angular/core';
import { Content, ModalController,ViewController, NavController, NavParams ,ActionSheetController,Platform,AlertController,LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import {DataService} from '../../providers/data-service';
import {UserService} from '../../providers/user-service';
import {AppSettings} from '../../providers/app-settings';
import { AngularFireDatabase } from 'angularfire2/database';

import { Camera } from '@ionic-native/camera';

/**
* Generated class for the ChatPage page.
*
* See http://ionicframework.com/docs/components/#navigation for more info
* on Ionic pages and navigation.
*/

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})

export class ChatPage {
  @ViewChild(Content) content: Content;
  fcmAuthKey = this.appSettings.getFcmAuthKey();
  apiImageURL = this.appSettings.getApiImageURL();
  messageCode:any;
  userCode:any;
  user:any;
  provider:any;
  creations:any;
  counter = Array;
  segment:any;
  view:any;
  message: string = '';
  subscription;
  messages: object[] = [];
  newmessages: object[] = [];
  dateTime:any;
  loading:any;

  constructor(private http: Http, public appSettings:AppSettings, public modalCtrl: ModalController, public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, public dataService:DataService, public userService:UserService, private camera: Camera,public platform:Platform,private alertCtrl: AlertController,public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController) {
    console.log(this.fcmAuthKey)
    this.userCode = this.navParams.get('userCode');
    console.log(this.userCode)
    this.view = this.navParams.get('view');
    this.start();
    this.retrieveMessages();
  }

  /* OPEN THE MODAL TO DISPLAY AN IMAGE WITHIN A CHAT */
  openModal(displayimage) {
    let modal = this.modalCtrl.create(ModalContentPage,displayimage);
    modal.present();
  }

/*
  pushSetup(title, message) {
    const options: PushOptions = {
      android: {},
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => {
      if (notification.additionalData.foreground) {
        let newAlert = this.alertCtrl.create({
          title: title,
          message: message
        });
        newAlert.present();
      }
    });

    pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }
*/

  /* SEND PUSH NOTIFICATIONS TO THE USERS PHONE WHEN A MESSAGE IS SENT */
  sendNotification(name, message, receiver) {
    let body = {
      "notification":{
        "title": name,
        "body": message,
        "sound":"default",
        "click_action":"FCM_PLUGIN_ACTIVITY",
        "icon":"fcm_push_icon"
      },
      "data":{
        "param1":"value1",
        "param2":"value2"
      },
      "to":receiver,
      "priority":"high",
      "restricted_package_name":""
    }

    let headers = new Headers({
      'Content-Type' : "application/json",
      'Authorization': this.fcmAuthKey
    });

    let options = new RequestOptions({ headers: headers });
    this.http.post("https://fcm.googleapis.com/fcm/send",body,options).subscribe();
  }


  /* GENERATE A NEW IMAGE CODE FOR SAVING THE IMAGE */

  generateCode(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 50; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    text = 'img' + text;
    return text;
  }


  /* GENERATE THE ALERT TO BE DISPLAYED IN CASE OF ERRORS */

  presentAlert(title,message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }


  /* SHOW LOADING MESSAGE */

  showLoading(message){
    this.loading = this.loadingCtrl.create({
      content: message
    });
    this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
    }, 60000);
  }


  /* SELECT HOW TO UPLOAD IMAGE TO THE CHAT */

  selectChatImage(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Upload Photo',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  /* TAKE PICTURE AND CREATE IMAGE */

  takePicture(sourceType) {
    let newImage:any;

    // Get the data of an image
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      quality: 70,
    }).then((imageData) => {
      // imageData is a base64 encoded string
      newImage = "data:image/png;base64," + imageData;
      newImage = newImage.replace(/(\r\n|\n|\r)/gm,"");

      this.addImage(newImage);
    }, (err) => {
      console.log('Error while selecting image.');
    });
  }


  /*
  * SAVE IMAGE TO THE DATABASE AND SEND CHAT
  * MESSAGE IS SENT TWICE SO BOTH USERS HAVE COPIES
  */

  addImage(imageData){

    this.showLoading('Uploading Image ..');

    this.dateTime = new Date();
    console.log(this.dateTime.toJSON())
    console.log(this.dateTime.toString())
    console.log(this.dateTime.getTime())

    this.messageCode = this.generateCode()

    this.dataService.saveImage(imageData,"chat"+this.messageCode).subscribe(data =>{

      try{
        if(data.message == "Successful"){

          this.db.list('/' + 'chats' + '/' + this.user.code).push({
            messagecode: this.messageCode,
            user: this.user.code,
            participant: this.provider.code,
            participantavatar: '',
            displayname: this.provider.name,
            sender: true,
            senderavatar: '',
            image: true,
            message: this.apiImageURL + data.imageName,
            timestamp: this.dateTime.toString()

          }).then( () => {
            //message successfully sent

          }).catch( () => {
            //some error and the message wasn't sent
            this.presentAlert('Error','Unable to send message at this time, please try again later')
          });

          this.db.list('/' + 'chats' + '/' + this.provider.code).push({
            messagecode: this.messageCode,
            user: this.user.code,
            participant: this.provider.code,
            participantavatar: '',
            displayname: this.provider.name,
            sender: false,
            senderavatar: '',
            image: true,
            message: this.apiImageURL + data.imageName,
            timestamp: this.dateTime.toString()
          }).then( () => {
            //message successfully sent
            this.loading.dismissAll();
            // Get the user device token and send notifications
            this.subscription = this.db.list('/' + 'devices' + '/' + this.provider.code);
            this.subscription.subscribe(snapshots => {
              if (snapshots.length > 0){
                this.sendNotification(this.user.name, "Image", snapshots[0].$value)
              }
              this.message = '';
            })

          }).catch( () => {
            //some error and the message wasn't sent
            this.presentAlert('Error','Unable to send message at this time, please try again later')
          });

        }else{
          this.loading.dismissAll();
          this.presentAlert('Oops','Failed to upload image, please try again');
        }
      } catch(error){
        this.loading.dismissAll();
        this.presentAlert('Oops','Please try again');
      }
    });
  }

  /*
  * SENDS A MESSAGE TO ANOTHER USER VIA CHAT
  * MESSAGE IS SENT TWICE SO BOTH USERS HAVE COPIES
  */

  sendMessage() {
    console.log("SEND MESSAGE");
    console.log(this.user.code);
    console.log(this.provider);
    this.dateTime = new Date();
    console.log(this.dateTime.toJSON())
    console.log(this.dateTime.toString())
    console.log(this.dateTime.getTime())

    this.db.list('/' + 'chats' + '/' + this.user.code).push({
      messagecode: this.generateCode(),
      user: this.user.code,
      participant: this.provider.code,
      participantavatar: '',
      displayname: this.provider.name,
      sender:true,
      senderavatar: '',
      image: false,
      message: this.message,
      timestamp: this.dateTime.toString()
    }).then( () => {
      // message successfully sent
    }).catch( (err) => {
      // some error and the message wasn't sent
      this.presentAlert('Error','Unable to send message at this time, please try again later')
    });

    this.db.list('/' + 'chats' + '/' + this.provider.code).push({
      messagecode: this.generateCode(),
      user: this.user.code,
      participant: this.provider.code,
      participantavatar: '',
      displayname: this.user.name,
      sender:false,
      senderavatar: '',
      image: false,
      message: this.message,
      timestamp: this.dateTime.toString()
    }).then( () => {
      // Message successfully sent
      // Get the user device token and send notifications
      this.subscription = this.db.list('/' + 'devices' + '/' + this.provider.code);
      this.subscription.subscribe(snapshots => {
        if (snapshots.length > 0){
          console.log(this.message)
          this.sendNotification(this.user.name, this.message, snapshots[0].$value)
        }
        this.message = '';
      })

    }).catch( (err) => {
      //some error and the message wasn't sent
      console.log(err)
      this.presentAlert('Error','Unable to send message at this time, please try again later')
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  /* SCROLL TO BOTTOM ON CHAT PAGE WHEN LOADED TO GET THE LATEST MESSAGES */
  ionViewWillEnter(): void {
    this.scrollToBottom();
  }

  /* SCROLL TO BOTTOM ON CHAT PAGE WHEN LOADED TO GET THE LATEST MESSAGES */
  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    });
  }

  /* GET THE DETAILS FOR THE 2 USERS IN A CHAT */
  start(){
    console.log("START");
    //load user and their posts from data service

    this.segment = 'work';
    this.user = this.userService.user;
    console.log("USER");
    console.log(this.user);
    console.log("USER CODE");
    console.log(this.userCode);
    console.log("USERS");
    console.log(this.dataService.users);
    if ((this.dataService.users.filter(item => item.code == this.userCode)[0]) == undefined){
      console.log("START 1");
      console.log(this.navParams.get('provider'))
      console.log(this.navParams.get('providername'))
      this.provider = {code : this.navParams.get('provider'), name:this.navParams.get('providername')}
    }
    else {
      console.log("START 2");
      this.provider =  this.dataService.users.filter(item => item.code == this.userCode)[0];
      console.log(this.provider);
    }
  }

  /* GET EXISTING MESSAGES */
  retrieveMessages() {
    this.subscription = this.db.list('/' + 'chats' + '/' + this.user.code, { preserveSnapshot: true });
    console.log(this.subscription)
    this.subscription.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        if ((snapshot.val().participant == this.userCode) && (snapshot.val().user == this.user.code)){
          console.log(snapshot.key)
          console.log(snapshot.val())

          this.newmessages.push(snapshot.val())
        }

        else if ((snapshot.val().participant == this.user.code) && (snapshot.val().user == this.userCode)){
          console.log(snapshot.key)
          console.log(snapshot.val())
          this.newmessages.push(snapshot.val())
          //this.pushSetup("Scizzor", "New message from " + this.provider.name)
        }
        this.messages = this.newmessages
      });
      this.newmessages = [];
    })
  }

}

/* MODAL CLASS FOR DISPLAYING IMAGES WITHIN THE CHATS */
@Component({
  template: `
  <ion-header>
  <ion-toolbar color="black">
  <ion-buttons start>
  <button ion-button (click)="dismiss()">
  <span ion-text color="main" showWhen="ios">Close</span>
  <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
  </button>
  </ion-buttons>
  </ion-toolbar>
  </ion-header>

  <ion-content>
  <img class="" src="{{image}}"  width="100%" height="100%" style="object-fit: cover;">
  </ion-content>

  `
})

export class ModalContentPage {
  image;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {

    this.image = this.params.get('imageurl');
    console.log(this.image)

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
