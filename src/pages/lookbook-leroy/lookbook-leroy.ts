import { ViewChild, OnInit } from '@angular/core';
import { Content } from 'ionic-angular';
import { Component } from '@angular/core';
import { ProfilePage } from '../profile/profile';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { UserProfilePage } from '../../pages/user-profile/user-profile';

import { DataService } from '../../providers/data-service';
import { UserService } from '../../providers/user-service';

import { CreateNewPage } from '../create-new/create-new';
import { ToastController } from 'ionic-angular';
import {Like} from "../../models/like-model";
import {Post} from "../../models/post-model";
import {SocialShareProvider} from "../../providers/social-share/social-share";
import {ErrorHandlerProvider} from "../../providers/error-handler/error-handler";

/**
 * Generated class for the LookbookLeroyPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-lookbook-leroy',
  templateUrl: 'lookbook-leroy.html',
})
export class LookbookLeroyPage implements OnInit {

  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;

  loading: any;
  alert: any;

  type: any;
  imageLink: any;
  showImage: any = false;
  images: Array<string> = [];
  index: any;
  date_stamp = Date.now()
  mode: any;
  pages: any;
  post: any;
  tags: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService, private toastCtrl: ToastController, public loadingCtrl: LoadingController, private alertCtrl: AlertController,private socialShare: SocialShareProvider, private errorHandler: ErrorHandlerProvider, public userService: UserService) {

    this.pages = navParams.get('pages');
    this.mode = navParams.get('mode');
    this.post = navParams.get('post');


    this.start(this.mode);
    this.helpToast();
      this.checkLiked();


  }

  user: any;

  ngOnInit() {
        this.showLoading("Please wait.");
        console.log("in on init leroy")
        this.dataService.getUserByCode(this.post.userCode).subscribe((res)=>{
          console.log("user component is",res);
          if (res.data.length>0) {
            this.user = res.data[0];
          }
          this.loading.dismissAll();
        })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LookbookLeroyPage');

  }

  start(mode) {

    if (mode == 'view') {
      let code = this.post.id;
      console.log(this.dataService.pages)
      console.log(code);
      //this.pages = this.dataService.pages.filter(item => item.inspirationCode == code);
      this.pages = this.dataService.findPage("inspiration_id",code);


    } else if (mode == 'edit') {

      this.dataService.lookbookPages = this.pages;

    } else if (mode == 'preview') {

      console.log('preview new lookbook');

    }



  /*  for (let page of this.pages) {
        this.dataService.getImageUrl(page.image,page);
    //  this.images.push(page.image);
    }
*/
    this.tags = this.dataService.tags.filter(item => item.inspiration_id == this.post.id);

  }

  helpToast() {
    this.presentToast('Scroll Sideways, Select Page For Full View', 'bottom');
  }

  presentToast(message, position) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: position
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  saveOld() {

    console.log("SAVE INSPIRATION ");
    this.showLoading('Saving ..');
    let i = 0;
    let counter = 0;

    if (this.mode == 'preview') {
      debugger;
      this.dataService.saveImage(this.post.image, "magazine"+this.dataService.me.id + "-" + Date.now()).subscribe(data => {
        if (data.message == "Successful") {
          this.post.image = data.imageName;
          if (this.pages.length > 0) {
            for (let page of this.pages) {
              this.dataService.saveImage(page.image, "magazine_page"+this.dataService.me.id + "-" + Date.now()).subscribe(data => {
                if (data.message == "Successful") {
                  counter = counter + 1;
                  if (counter == (this.pages.length - 1)) {
                    console.log('all images saved');
                    // this.post.image = this.post.code + '.png';
                    i = 0;
                    for (let page of this.pages) {
                      page.image = data.imageName;
                      i = i + 1;
                    }
                    //this.loading.dismissAll();
                    this.dataService.saveNewInspiration(this.post, this.pages).subscribe(data => {
                      try {
                        console.log(data);
                      } catch (error) {
                        console.log('inspiration save error');
                      }
                    });
                    this.navCtrl.parent.select(0);
                  }
                }
              });
              i = i + 1;
            }
          }
          else {
            this.dataService.saveNewInspiration(this.post, this.pages).subscribe(data => {
              try {
                console.log(data);
                this.loading.dismissAll();
                this.navCtrl.parent.select(0);
              } catch (error) {
                this.loading.dismissAll();
                console.log('inspiration save error');
              }
            });
            this.loading.dismissAll();
            this.navCtrl.parent.select(0);
          }
        }
        else {
          this.loading.dismissAll();
          this.presentAlert('Oops', 'Please try again');
        }
        /* } catch (error) {
          this.loading.dismissAll();
          this.presentAlert('Oops', 'Please try again');
        } */
        this.navCtrl.parent.select(0);
      });
    }
    else if (this.mode == 'edit') {

      //this.dataService.pages = this.dataService.pages.filter(item => item.inspirationCode != this.post.code);
      this.dataService.pages = this.dataService.findPage("inspiration_id",this.post.id);
      for (let page of this.dataService.lookbookPages) {
        this.dataService.pages.push(page);
      }
      this.dataService.saveImage(this.post.image, "magazine"+this.dataService.me.id + "-" + Date.now()).subscribe(data => {
        // if pages found
          this.post.image = data.imageName;
        if (this.pages.length > 0) {
          for (let page of this.pages) {
            page.inspirationCode = this.post.id;
            debugger;
            this.dataService.saveImage(page.image, "magazine_page"+this.dataService.me.id + "-" + Date.now()).subscribe(data => {
              console.log(data.message)
              if (data.message == "Successful") {
                counter = counter + 1;
                console.log(this.pages.length)
                console.log(counter)
                //  Logic Need to check why it's hapning
                debugger;
                if (counter == (this.pages.length)) {
                  console.log('all images saved');
                  // this.post.image = this.post.code + '.png';
                  i = 0;
                  for (let page of this.pages) {
                    page.inspirationCode = this.post.id;
                    page.image = data.imageName;
                    i = i + 1;
                  }
                  debugger;
                  this.dataService.updateInspiration(this.post.id, this.post, this.pages).subscribe(data => {
                    console.log(data)
                    this.loading.dismissAll();
                    this.navCtrl.parent.select(0);
                  })
                }
              }
            });
            i = i + 1;
          }
        }
        else {
          this.dataService.updateInspiration(this.post.code, this.post, this.pages).subscribe(data => {
            console.log(data)
            this.loading.dismissAll();
            this.navCtrl.parent.select(0);
          })
        }
      })

      this.loading.dismissAll();
      console.log('closing edit');
      this.navCtrl.parent.select(0);
    }
    this.navCtrl.setRoot(CreateNewPage);
  }



    save() {
        //admin options
        console.log("SAVE INSPIRATION LOOKBOK");
        this.showLoading('Saving ..');

        let counter = 0;

        if (this.mode == 'preview') {
            this.dataService.saveImage(this.post.image, "magazine"+this.dataService.me.id + "-" + Date.now()).subscribe(data => {
                if (data.message == "Successful") {
                    this.post.image = data.imageName;
                    if (this.pages.length > 0) {
                        console.log("HAS PAGES");
                        console.log(this.pages.length);
                        for (let page of this.pages) {
                            this.dataService.saveImage(page.image, "magazine_page"+this.dataService.me.id + "-" + Date.now()).subscribe(data => {
                                if (data.message == "Successful") {
                                    counter++;
                                    if (counter == (this.pages.length)) {
                                        console.log('all images saved');
                                        // this.post.image = this.post.code + '.png';

                                        for (let page of this.pages) {
                                            page.image = data.imageName;
                                        }
                                        this.loading.dismissAll();
                                        this.dataService.saveNewInspiration(this.post, this.pages).subscribe(data => {
                                            if(data.status) {
                                                console.log("SAVED INSPIRATION");
                                                console.log(data);
                                            }
                                            else
                                            {
                                                console.log("ERROR SAVING INSPIRATION");
                                                this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.inspiration[1].title,ErrorHandlerProvider.MESSAGES.error.inspiration[1].msg);
                                            }
                                        });
                                        this.navCtrl.parent.select(0);
                                    }
                                }
                                else {
                                    this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.image[0].title,ErrorHandlerProvider.MESSAGES.error.image[0].msg);
                                }
                            });
                        }


                    }
                    else {
                        console.log("NO PAGES");
                        this.dataService.saveNewInspiration(this.post, this.pages).subscribe(data => {
                            try {
                                if(data.status) {
                                    console.log(data);
                                    //  this.loading.dismissAll();
                                    this.navCtrl.parent.select(0);
                                }
                                else{
                                    this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.inspiration[1].title,ErrorHandlerProvider.MESSAGES.error.inspiration[1].msg);
                                }

                            } catch (error) {
                                //   this.loading.dismissAll();
                                this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.inspiration[1].title,ErrorHandlerProvider.MESSAGES.error.inspiration[1].msg);
                                console.log('inspiration save error');
                            }
                        });
                        //  this.loading.dismissAll();
                        this.navCtrl.parent.select(0);
                    }
                }
                else {
                    this.loading.dismissAll();
                    this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.image[0].title,ErrorHandlerProvider.MESSAGES.error.image[0].msg);
                    this.presentAlert('Oops', 'Please try again');
                }
                /* } catch (error) {
                  this.loading.dismissAll();
                  this.presentAlert('Oops', 'Please try again');
                } */
                this.navCtrl.parent.select(0);
            });
        }
        else if (this.mode == 'edit') {
            console.log("UPDATE INSPIRATION");
            console.log(this.post.image);
            this.dataService.pages = this.dataService.findPage("inspiration_id",this.post.id,false);
            for (let page of this.dataService.lookbookPages) {
                this.dataService.pages.push(page);
            }
            this.dataService.saveImage(this.post.image, "magazine"+this.dataService.me.id + "-" + Date.now()).subscribe(data => {
                if(data.message = "Successful"){
                    this.post.image = data.imageName; // new image
                    this.post.imageUrl = "";
                    console.log("Image is changed");
                    console.log(this.post.image);
                }

                this.dataService.updateInspiration(this.post.id,this.post,this.pages).subscribe(data=>{
                    if(data.status == 1){
                        console.log("Inspiration saved");
                        if(this.pages.length > 0){
                            for (let page of this.pages) {
                                page.inspiration_id = this.post.id;
                                this.dataService.saveImage(page.image, "magazine_page"+this.dataService.me.id + "-" + Date.now()).subscribe(data => {
                                    if (data.message == "Successful") {
                                        page.image = data.imageName;
                                        console.log("Page image changed");
                                        counter++;
                                    }
                                    else if(data.status == 2){ // image not updated
                                        counter++;
                                    }
                                    if (counter == (this.pages.length)) {
                                        console.log('all images saved');
                                        this.dataService.updateInspirationPages(this.post.id,this.pages).subscribe(data => {
                                            if(data.status){
                                                this.loading.dismissAll();
                                                this.navCtrl.parent.select(0);
                                            }
                                            else
                                            {
                                                this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.inspiration[2].title,ErrorHandlerProvider.MESSAGES.error.inspiration[2].msg);
                                            }
                                        })
                                    }
                                });
                            }
                        }
                        else { // no pages
                            this.loading.dismissAll();
                            this.navCtrl.parent.select(0);
                        }
                    }
                    else {
                        this.loading.dismissAll();
                        this.navCtrl.parent.select(0);
                        this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.inspiration[2].title,ErrorHandlerProvider.MESSAGES.error.inspiration[2].msg);
                    }
                });
            });
        }
    }
  viewImage(link) {
    this.imageLink = link;
    this.showImage = true;
    this.content.scrollToTop();
  }

  closeImage() {
    this.content.scrollToBottom();
  }

  goToSlide(forward) {
    this.index = this.slides.getActiveIndex();
    if (forward) {
      this.slides.slideTo((this.index + 1), 500);
    } else {
      this.slides.slideTo((this.index - 1), 500);
    }
  }

  slideChanged() {
    this.index = this.slides.getActiveIndex();
    console.log('Current index is', this.index);
  }

  getUser(tag) {
    let user = this.dataService.users.filter(item => item.id == tag.userCode)[0];
    return user.name;
  }

  getImage(tag) {
    let user = this.dataService.users.filter(item => item.id == tag.userCode)[0];
    return user.imageUrl;
  }

  showLoading(message) {
    this.loading = this.loadingCtrl.create({
      content: message
    });
    this.loading.present();
    setTimeout(() => {
      this.loading.dismiss();
    }, 5000);
  }

  presentAlert(title, message) {
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Dismiss']
    });
    this.alert.present();
  }


  goBack() {
    this.navCtrl.pop();
  }

  openProfile(tag) {
    //open profile of service
    let user = this.dataService.users.filter(item => item.code == tag.userCode)[0];
    this.navCtrl.push(ProfilePage, {
      userCode: user.code,
      view: 'service'
    });
  }

  getCreator(code){
    let user = this.dataService.users.filter(item => item.code == code)[0];
    return user.name;
  }


  getUserImage(code){
    let user = this.dataService.users.filter(item => item.code == code)[0];
    return user.image;
  }

  openUserProfile(code){
    console.log(code)
    console.log(this.userService.user.code)
    let user = this.dataService.users.filter(item => item.code == code)[0];

    if (this.userService.user.code == code){
      this.navCtrl.setRoot(UserProfilePage,{
        view:'service'
      });
      this.navCtrl.parent.select(2);
    }

    else {
      this.navCtrl.push(ProfilePage,{
        userCode:user.code,
        view:'service'
      });
    }
  }





    checkLiked(){
        // check if you have liked the selected post previously
        console.log(this.dataService.likes);
        this.pages.forEach((page, index) => {
            console.log("PAGE",page);
            if(this.dataService.likes.filter(item => item.creationCode == 'inspirationpage'+page.id).length > 0){
                let reLikedCreation = this.dataService.likes.filter(item => item.creationCode == 'inspirationpage'+page.id)[0];
                console.log('liked');
                page.liked = reLikedCreation.liked;
            }else{
                console.log('not liked');
                page.liked = false;
            }
        });
    }

    like(like){
        //like post, add to likes

        //like post, add to likes
        console.log("Liked code", like.id);
        if(this.dataService.likes.filter(item => item.creationCode == 'inspirationpage'+like.id).length > 0){
            let reLikedCreation = this.dataService.likes.filter(item => item.creationCode == 'inspirationpage'+like.id)[0];
            reLikedCreation.liked = true;
            //update database
        }else{
            let likedCreation = new Like ('',this.dataService.me.id, 'inspirationpage'+like.id,true,like.imageUrl);
            this.dataService.likes.splice(0,0,likedCreation);
            this.dataService.saveLike(likedCreation);
            //save like
        }

        this.checkLiked();

    }
    facebookShare(creation: Post) {
        this.socialShare.shareMagazine(creation,'Facebook');
    }
    twitterShare(creation: Post){
        this.socialShare.shareMagazine(creation,'Twitter');

    }
    instagramShare(creation: Post){
        this.socialShare.shareMagazine(creation,'Instagram');
    }
    whatsappShare(creation: Post){
        this.socialShare.shareMagazine(creation,'Whatsapp');
    }
    emailShare(creation: Post){
        this.socialShare.shareMagazine(creation,'Email');
    }


}
