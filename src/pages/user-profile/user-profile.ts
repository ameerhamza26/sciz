import { Component } from '@angular/core';
import { NavController, NavParams,ActionSheetController,Platform,AlertController,LoadingController } from 'ionic-angular';

import {DataService} from '../../providers/data-service';
import {UserService} from '../../providers/user-service';
import { CreationPage } from '../creation/creation';
import { LoginPage } from '../login/login';


import { App } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { EmailComposer } from '@ionic-native/email-composer';

/**
 * Generated class for the UserProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  user :any;
  sizeCode:any;
  permission:any;
  segment:any;
  size:any;
  counter = Array;
  creations:any;
  showSettings:any = false;
  profileChanged:any = false;
  sizesChanged:any = false;
  userCopy:any;
  loading:any;
  options:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public dataService:DataService,public userService:UserService,private app: App,public actionSheetCtrl: ActionSheetController,private camera: Camera,public platform:Platform,private alertCtrl: AlertController,public loadingCtrl: LoadingController, private emailComposer: EmailComposer) {
    this.start();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
    this.start();
  }

  ionViewWillEnter(){
  //reload own posts on entry
    console.log('re-entry');

    if(this.permission == 'customer'){
      this.getSizes();
      this.dataService.getLikes();
    }else if(this.permission == 'service') {
      this.getCreations();
    }
  }

  start(){

    this.segment = 'likes';
    this.user = this.userService.user;
    this.userCopy = this.user;
    this.permission = this.dataService.permission;
    this.sizeCode = this.user.sizeCode;

    if(this.permission == this.user.type){
      console.log('matching permissions');
    }else{
      console.log('error , no matching permissions');
    }

    if(this.permission == 'customer'){
      this.getSizes();
    }else if(this.permission == 'service'){
      this.getCreations();


      if(this.user.type2 == 'Craftsman'){
        this.options  = ['Tailor','Shoe Maker'];
      }else if(this.user.type2 == 'Designer'){
        this.options = ['Local','International African Designer'];
      }else if(this.user.type2 == 'Fabric Retailer'){
        this.options  = ['Local','International Fabric Retailer'];
      }else if(this.user.type2 == 'Manufacturer'){
        this.options  = ['Local','International Manufacturer'];
      }

    }

  }

  createNewCreation(){

    //create new post - > segue

    console.log('creating new ');

    this.navCtrl.push(CreationPage,{
      creating:true
    });


  }

  getCreations(){
    //get my posts from data service
    this.creations =  this.dataService.creations.filter(item => item.userCode == this.user.code);
  }

  getImage(creation){
    let temp =   this.dataService.creations.filter(item => item.code == creation.creationCode)[0];
    return temp.image;
  }

  openLike(creation2Open){

    creation2Open =   this.dataService.creations.filter(item => item.code == creation2Open.creationCode)[0];

    console.log('open creation: ' + creation2Open);
    this.navCtrl.push(CreationPage,{
      creation : creation2Open
    });
  }

  openCreation(creation2Open){

    creation2Open =   this.dataService.creations.filter(item => item.code == creation2Open.code)[0];


      let actionSheet = this.actionSheetCtrl.create({
        title: 'Options',
        buttons: [
          {
            text: 'View',
            handler: () => {
              console.log('open creation: ' + creation2Open);
              this.navCtrl.push(CreationPage,{
                creation : creation2Open
              });

            }
          }, {
            text: 'Edit',
            handler: () => {
              console.log('open creation: ' + creation2Open);
              this.navCtrl.push(CreationPage,{
                creation : creation2Open,
                editing:true
              });

            }
          },
          {
            text: this.getAvailability(creation2Open),
            handler: () => {


              if(creation2Open.availability){
                creation2Open.availability = false;
              }else{
                creation2Open.availability = true;
              }

              this.dataService.updateAvailability(creation2Open.code,creation2Open.availability);


              //update availability


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

  getAvailability(creation){
    let text = "";


    if(creation.availability){
      text = "Set Unavailable";
    }else{
      text = "Set Available";
    }

  return text;

  }

  getSizes(){
    console.log('getting sizes');


    this.size = this.dataService.sizes.filter(item => item.sizeCode == this.sizeCode)[0];

    console.log(this.size);



  }

  selectProfileImage(){


    let actionSheet = this.actionSheetCtrl.create({
      title: 'Change Profile Image',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
            //this.updateProfileImage();

          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
            //this.updateProfileImage();

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

  takePicture(sourceType) {

    let newImage:any;


    // Get the data of an image
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      quality:100
    }).then((imageData) => {
      // imageData is a base64 encoded string
      newImage = "data:image/png;base64," + imageData;
      newImage = newImage.replace(/(\r\n|\n|\r)/gm,"");

      this.updateProfileImage(newImage);

    }, (err) => {

      console.log('Error while selecting image.');
    });


  }

  updateProfileImage(imageData){

    this.showLoading('Updating ..');

    this.dataService.saveImage(imageData,this.user.code).subscribe(data =>{

      try{
        if(data.message == "Successful"){


            this.user.image = this.user.code + '.png';
            this.dataService.updateProfile(this.user).subscribe(data =>{


              if(data.message == "Successful"){
                console.log('profile saved');

                this.user.image = imageData;

                this.loading.dismissAll();
                this.navCtrl.parent.select(2);

              }else{
                this.presentAlert('Oops','New profile image not saved');
              }

            });



        }else{
          this.loading.dismissAll();
         this.presentAlert('Oops','New profile image not saved');
        }
      } catch(error){
        this.loading.dismissAll();
        this.presentAlert('Oops','Please try again');
      }

    });


  }

  settings(){

    if(this.showSettings){
      this.showSettings = false;
    }else{
      this.showSettings = true;
    }
    console.log('settings');
  }

  fieldUpdate(){
    console.log('text changing');
    this.profileChanged = true;
  }

  sizeUpdate(){
    this.sizesChanged = true;
  }

  updateProfile(){

    if(this.profileChanged){

      this.showLoading('Updating ..');

      let cleanUser = this.user;
      cleanUser.image = "";
      cleanUser.image = cleanUser.code + '.png';
      this.dataService.updateProfile(cleanUser).subscribe(data =>{

        if(data.message == "Successful"){
          this.profileChanged = false;
          this.loading.dismissAll();
          this.user.image = this.dataService.apiUrl + 'images/' + this.user.image;

        }else{
          this.loading.dismissAll();
          this.presentAlert('Oops','Please try again');
        }

      });

    }else if(this.sizesChanged){

      this.showLoading('Updating ..');
      this.dataService.updateSize(this.size);
      this.sizesChanged = false;
      this.loading.dismissAll();

    }




  }

  showLoading(message){

    this.loading = this.loadingCtrl.create({
      content: message
    });
    this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
    }, 30000);


  }

  presentAlert(title,message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  sendMail() {
    let email = {
          to: '',
          cc: '',
          bcc: [],
          attachments: [],
          subject: 'Measurement Request',
          body: 'I would like to get myself measured, when would this be possible?',
          isHtml: true
        };
        this.emailComposer.open(email);
    }



  logout(){
    this.app.getRootNav().push(LoginPage);


  }




}