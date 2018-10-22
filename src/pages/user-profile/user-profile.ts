import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, AlertController, LoadingController } from 'ionic-angular';

import { DataService } from '../../providers/data-service';
import { UserService } from '../../providers/user-service';
import { CreationPage } from '../../pages/creation/creation';
import { LoginPage } from '../../pages/login/login';
import { PaymentHistoryPage } from '../../pages/payment-history/payment-history';

import { App } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import { EmailComposer } from '@ionic-native/email-composer';
import {LookbookLeroyPage} from "../lookbook-leroy/lookbook-leroy";
import {LookbookPage} from "../lookbook/lookbook";
import {LookbookFlipPage} from "../lookbook-flip/lookbook-flip";
import {ErrorHandlerProvider} from "../../providers/error-handler/error-handler";

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

  user: any;
  sizeCode: any;
  permission: any;
  segment: any;
  size: any;
  counter = Array;
  creations: any;
  showSettings: any = false;
  profileChanged: any = false;
  sizesChanged: any = false;
  userCopy: any;
  loading: any;
  options: any;
  likes: any = [];
  isPageOpen:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService, public userService: UserService, private app: App, public actionSheetCtrl: ActionSheetController, private camera: Camera, public platform: Platform, private alertCtrl: AlertController, public loadingCtrl: LoadingController, private emailComposer: EmailComposer, private storage: Storage,private errorHandler: ErrorHandlerProvider) {
    this.start();
    //this.likes = this.dataService.likes;
    console.log("USER PROF CONSTR");
    console.log(this.likes);
  }


  ionViewDidLoad() {
    this.isPageOpen = true;
    console.log('ionViewDidLoad UserProfilePage');
   
  }

  ionViewWillEnter() {

 this.start();
      console.log("Ion will enter profile");
      //this.dataService.getLikes();
      this.isPageOpen = true;
  }
    
  ionViewWillLeave() {
      this.likes = [];
      this.isPageOpen = false;
  }
  navParamUserCode: any;
  start() {

    this.segment = 'likes';
    this.user = this.userService.user;
    this.permission = this.dataService.permission;

    this.navParamUserCode = this.navParams.get("user");
    if (this.navParamUserCode != undefined) {
      this.user  = this.navParamUserCode;
      this.permission = this.navParams.get("view");
    }
    this.loading = this.loadingCtrl.create({
      content: "Please wait..."
    });

    this.loading.present().then(()=> {
      if (this.permission == 'service') {
        this.dataService.getUserByCode(this.user.id).subscribe((res)=> {
          this.user= res.json().data[0];
          this.dataService.getCreationByUser(this.user.id).subscribe((res)=> {
            this.creations = res.json().result;
            if (this.user.bankAccountHolder.length == 0 || this.user.bankAccountNumber.length == 0 || this.user.bankAccountSortCode.length == 0){
              let promises_array:Array<any> = [];
              let that = this;
              for (let creation of this.creations) {
                if (creation.availability){
                  creation.availability = false;
                  promises_array.push(new Promise(function(resolve,reject) {
                    that.dataService.updateAvailability(creation.code, creation.availability).subscribe((data) => {
                      resolve(data);
                    }, (err)=> {
                      reject(err);
                    });
                  }));
                }
              }
              if (promises_array.length > 0)  {
                Promise.all(promises_array).then((data)=> {
                  this.loading.dismissAll();
                });
              } else {
                this.loading.dismissAll();
              }
            } else {
              this.loading.dismissAll();
            }
          })
        })
      } else {
        this.dataService.getUserByCode(this.user.id).subscribe((res)=> {
          this.user= res.json().data[0];
          this.dataService.getLikesByUser(this.user.id).subscribe((res)=> {
            this.likes = res.json().result;
            this.dataService.getSizesByUserCode(this.user.code).subscribe((res)=> {
              this.size = res.json().result[0];
              this.loading.dismissAll();
            })
          })
        })
      }

    })

    this.userCopy = this.user;

    console.log(this.dataService)
    console.log(this.userService)
    this.sizeCode = this.user.sizeCode;

    if (this.permission == this.user.type) {
      console.log('matching permissions');
    } else {
      console.log('error , no matching permissions');
    }

    if (this.permission == 'customer') {
      //this.getSizes();
    //  this.dataService.getLikes();
      //this.likes = this.dataService.likes;
    } else if (this.permission == 'service') {

      if (this.user.type2 == 'Craftsman') {
        this.options = ['Tailor', 'Shoe Maker'];
      } else if (this.user.type2 == 'Designer') {
        this.options = ['Local', 'International African Designer'];
      } else if (this.user.type2 == 'Fabric Retailer') {
        this.options = ['Local', 'International Fabric Retailer'];
      } else if (this.user.type2 == 'Manufacturer') {
        this.options = ['Local', 'International Manufacturer'];
      }

    }

  }

  createNewCreation() {

    if (this.user.bankAccountHolder.length == 0 || this.user.bankAccountNumber.length == 0 || this.user.bankAccountSortCode.length == 0){
          this.presentAlert("Error", "Please enter your account details in your profile before proceeding")
        }

    //create new post - > segue
    else {
      console.log('creating new ');
      this.navCtrl.push(CreationPage, {
        creating: true
      });
    }
  }


  getImage(creation) {
    if(creation.creationCode.substr(0,15) !== "inspirationpage") {
        console.log("GET IMAGE 1");
        console.log(creation);
        let temp = this.dataService.creations.filter(item => item.id == creation.creationCode.substr(8))[0];
        console.log(temp.image);
        if(temp.image){
            this.dataService.getImageUrl(temp.image,creation);
            return temp.image;
        }
    }
    else {
        console.log("GET IMAGE 2");
        console.log(creation.creationCode.substr(15));
        //console.log(this.dataService.pages);
        //let temp = this.dataService.pages.filter(item => item.code == creation.creationCode)[0];
        let temp = this.dataService.findPage("id",creation.creationCode.substr(15))[0];
        if(temp != undefined && temp.image){
            this.dataService.getImageUrl(temp.image,creation);
            console.log(temp.image);
            return temp.image;
        }
    }
  }

  imageBaseUrl = "https://storingimagesandvideos.s3.us-east-2.amazonaws.com/";
  openLike(creation2Open) {
    console.log(creation2Open);
      if(creation2Open.creationCode.substr(0,15) !== "inspirationpage"){
        console.log(this.dataService.creations);
        //creation2Open = this.dataService.creations.filter(item => item.id == creation2Open.creationCode.substr(8))[0];
        this.dataService.getCreationById(creation2Open.code).subscribe((res)=> {
          var data =res.json().result[0]
          data.imageUrl = this.imageBaseUrl + data.image;
          this.navCtrl.push(CreationPage, {
            creation:data
          });
        }) 
        console.log('open creation: ' + creation2Open);
        
    } else {
          this.dataService.getInspirationsByPageId(creation2Open.code).subscribe((res)=> {
            var result = res.json().result;
            if (result.length >0) {
              for (let inspiration of result) {
                let image =  inspiration.image;
                inspiration.image = image;
                inspiration.likes = 0; // magazine likes - random for testing
                inspiration.imageUrl = this.imageBaseUrl + image;
                let likes = 0;
                for (let pages of inspiration.pages) {
                  console.log("pages",pages, pages.likes);
                  likes = likes + pages.likes ;
                  pages.imageUrl = this.imageBaseUrl + pages.image;
                }
                inspiration.totalLikes = likes;
                /* inspirationPages.forEach((page, index) => {
                      pageLikes = this.likes.filter(item => item.creationCode == page.code);
                      console.log("PAGE LIKES");
                      console.log(pageLikes);
                      console.log(pageLikes.length);
                      inspiration.likes = pageLikes.length;
                  }); */
                
            }
            this.openLookbook(result[0]);
              
            }
          })
      }

  }

    openLookbook(post) {
        //open lookbook according to style -> segue
        console.log('Open Lookbook',post);
        if (post.type == 'vertical' || post.type == 'horizontal') {
            this.navCtrl.push(LookbookPage, {
                post: post,
                mode: 'view'
            });
        } else if (post.type == 'leroy') {
            this.navCtrl.push(LookbookLeroyPage, {
                post: post,
                mode: 'view'
            });
        } else if (post.type == 'flip') {
            this.navCtrl.push(LookbookFlipPage, {
                post: post,
                mode: 'view'
            });
        }

    }

  openCreation(creation2Open) {

    if (this.user.bankAccountHolder.length == 0 || this.user.bankAccountNumber.length == 0 || this.user.bankAccountSortCode.length == 0){

          let actionSheet = this.actionSheetCtrl.create({
            title: 'Options',
            buttons: [
              {
                text: 'View',
                handler: () => {
                  console.log('open creation: ' + creation2Open);
                  this.navCtrl.push(CreationPage, {
                    creation: creation2Open
                  });

                }
              }, {
                text: 'Edit',
                handler: () => {
                  console.log('open creation: ' + creation2Open);
                  this.navCtrl.push(CreationPage, {
                    creation: creation2Open,
                    editing: true
                  });

                }
              },
              {
                text: 'Cancel',
                role: 'cancel'
              }
            ]
          });
          actionSheet.present();

            this.dataService.updateAvailability(creation2Open.id, creation2Open.availability);
          }

    else {

          let actionSheet = this.actionSheetCtrl.create({
            title: 'Options',
            buttons: [
              {
                text: 'View',
                handler: () => {
                  console.log('open creation: ' + creation2Open);
                  this.navCtrl.push(CreationPage, {
                    creation: creation2Open
                  });

                }
              }, {
                text: 'Edit',
                handler: () => {
                  console.log('open creation: ' + creation2Open);
                  this.navCtrl.push(CreationPage, {
                    creation: creation2Open,
                    editing: true
                  });

                }
              },
              {
                text: this.getAvailability(creation2Open),
                handler: () => {


                  if (creation2Open.availability) {
                    creation2Open.availability = false;
                  } else {
                    creation2Open.availability = true;
                  }

                  this.dataService.updateAvailability(creation2Open.id, creation2Open.availability);


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



  }

  getAvailability(creation) {
    let text = "";


    if (creation.availability) {
      text = "Set Unavailable";
    } else {
      text = "Set Available";
    }

    return text;

  }

  getSizes() {
    console.log('getting sizes');


    this.size = this.dataService.sizes.filter(item => item.userCode == this.user.code)[0];

    console.log(this.size);



  }

  selectProfileImage() {


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

    let newImage: any;


    // Get the data of an image
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      quality: 70
    }).then((imageData) => {
      // imageData is a base64 encoded string
      newImage = "data:image/png;base64," + imageData;
      newImage = newImage.replace(/(\r\n|\n|\r)/gm, "");

      this.updateProfileImage(newImage);

    }, (err) => {

      console.log('Error while selecting image.');
    });


  }

  updateProfileImage(imageData) {

    this.showLoading('Updating ..');

    console.log("Save user profile image,name is: ",'user_profile'+this.user.id);
    this.dataService.saveImage(imageData, "user_profile"+this.user.id).subscribe(data => {

      try {
        if (data.message == "Successful") {

          console.log("Profile image uploaded,name is: ", data.imageName);

          this.user.image = data.imageName;
          this.dataService.updateProfile(this.user).subscribe(data => {


            if (data.message == "Successful") {
              console.log('profile saved');

              //this.user.image = imageData;
              console.log("Get image url for user profile, ",this.user.image);
              this.dataService.getImageUrl(this.user.image,this.user);

              this.loading.dismissAll();
              this.navCtrl.parent.select(2);

            } else {
                this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.profile[0].title,ErrorHandlerProvider.MESSAGES.error.profile[0].msg);
            }

          });



        } else {
          this.loading.dismissAll();
            this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.image[2].title,ErrorHandlerProvider.MESSAGES.error.image[2].msg);
        }
      } catch (error) {
        this.loading.dismissAll();
          this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.image[2].title,ErrorHandlerProvider.MESSAGES.error.image[2].msg);
          }

    });


  }

  settings() {

    if (this.showSettings) {
      this.showSettings = false;
    } else {
      this.showSettings = true;
    }
    console.log('settings');
  }

  fieldUpdate() {
    console.log('text changing');
    this.profileChanged = true;
  }

  sizeUpdate() {
    this.sizesChanged = true;
  }

  updateProfile() {

    if (this.profileChanged) {

      this.showLoading('Updating ..');

      let cleanUser = this.user;
      cleanUser.image = "";
      cleanUser.image = cleanUser.id + '.png';
      this.dataService.updateProfile(cleanUser).subscribe(data => {

        if (data.message == "Successful") {
          this.profileChanged = false;
          this.loading.dismissAll();
          this.user.image = this.dataService.apiUrl + 'images/' + this.user.image;

        } else {
          this.loading.dismissAll();
            this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.profile[0].title,ErrorHandlerProvider.MESSAGES.error.profile[0].msg);
          }

      });

    } else if (this.sizesChanged) {
      console.log("this size",this.size);
      this.showLoading('Updating ..');
      this.dataService.updateSize(this.size).subscribe((res)=> {
        this.sizesChanged = false;
        this.loading.dismissAll();
      },(err)=> {
        this.sizesChanged = false;
        this.loading.dismissAll();
      });
    }




  }

  showLoading(message) {

    this.loading = this.loadingCtrl.create({
      content: message
    });
    this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
    }, 30000);


  }

  presentAlert(title, message) {
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

  logout() {
    this.storage.clear()
    this.app.getRootNav().push(LoginPage);
  }

  openPayments() {
    this.navCtrl.push(PaymentHistoryPage)
    };

}
