import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { Component } from '@angular/core';
import { ProfilePage } from '../profile/profile';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Slides } from 'ionic-angular';


import { DataService } from '../../providers/data-service';
import { CreateNewPage } from '../create-new/create-new';
import { ToastController } from 'ionic-angular';
import {Like} from "../../models/like-model";
import {Post} from "../../models/post-model";
import {SocialShareProvider} from "../../providers/social-share/social-share";

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
export class LookbookLeroyPage {

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService, private toastCtrl: ToastController, public loadingCtrl: LoadingController, private alertCtrl: AlertController,private socialShare: SocialShareProvider) {

    this.pages = navParams.get('pages');
    this.mode = navParams.get('mode');
    this.post = navParams.get('post');


    this.start(this.mode);
    this.helpToast();
      this.checkLiked();


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LookbookLeroyPage');
  }

  start(mode) {

    if (mode == 'view') {
      let code = this.post.code;
      console.log(this.dataService.pages)
      console.log(code)
      this.pages = this.dataService.pages.filter(item => item.inspirationCode == code);


    } else if (mode == 'edit') {

      this.dataService.lookbookPages = this.pages;

    } else if (mode == 'preview') {

      console.log('preview new lookbook');

    }



    for (let page of this.pages) {
      this.images.push(page.image);
    }

    this.tags = this.dataService.tags.filter(item => item.inspirationCode == this.post.code);

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

  save() {

    this.showLoading('Saving ..');
    let i = 0;
    let counter = 0;

    if (this.mode == 'preview') {
      debugger;
      this.dataService.saveImage(this.post.image, this.post.code).subscribe(data => {
        if (data.message == "Successful") {
          if (this.pages.length > 0) {
            for (let page of this.pages) {
              this.dataService.saveImage(page.image, page.inspirationCode + i).subscribe(data => {
                if (data.message == "Successful") {
                  counter = counter + 1;
                  if (counter == (this.pages.length - 1)) {
                    console.log('all images saved');
                    // this.post.image = this.post.code + '.png';
                    i = 0;
                    for (let page of this.pages) {
                      page.image = page.inspirationCode + i + '.png';
                      i = i + 1;
                    }
                    this.loading.dismissAll();
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

      this.dataService.pages = this.dataService.pages.filter(item => item.inspirationCode != this.post.code);
      for (let page of this.dataService.lookbookPages) {
        this.dataService.pages.push(page);
      }
      this.dataService.saveImage(this.post.image, this.post.code).subscribe(data => {
        // if pages found
        if (this.pages.length > 0) {
          for (let page of this.pages) {
            page.inspirationCode = this.post.code;
            debugger;
            this.dataService.saveImage(page.image, page.inspirationCode + i).subscribe(data => {
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
                    page.inspirationCode = this.post.code;
                    page.image = page.inspirationCode + i + '.png';
                    i = i + 1;
                  }
                  debugger;
                  this.dataService.updateInspiration(this.post.code, this.post, this.pages).subscribe(data => {
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
    let user = this.dataService.users.filter(item => item.code == tag.userCode)[0];
    return user.name;
  }

  getImage(tag) {
    let user = this.dataService.users.filter(item => item.code == tag.userCode)[0];
    return user.image;
  }

  showLoading(message) {
    this.loading = this.loadingCtrl.create({
      content: message
    });
    this.loading.present();
    setTimeout(() => {
      this.loading.dismiss();
    }, 120000);
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

    checkLiked(){
        // check if you have liked the selected post previously
        console.log(this.dataService.likes);
        this.pages.forEach((page, index) => {
            console.log("PAGE",page);
            if(this.dataService.likes.filter(item => item.creationCode == page.code).length > 0){
                let reLikedCreation = this.dataService.likes.filter(item => item.creationCode == page.code)[0];
                console.log('liked');
                page.liked = reLikedCreation.liked;
            }else{
                console.log('not liked');
                page.liked = false;
            }
        });
    }

    like(code){
        //like post, add to likes

        //like post, add to likes
        console.log("Liked code", code);
        if(this.dataService.likes.filter(item => item.creationCode == code).length > 0){
            let reLikedCreation = this.dataService.likes.filter(item => item.creationCode == code)[0];
            reLikedCreation.liked = true;
            //update database
        }else{
            let likedCreation = new Like ('',this.dataService.me.code, code,true);
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
