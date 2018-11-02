import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { ToastController } from 'ionic-angular';
import {ErrorHandlerProvider} from "../../providers/error-handler/error-handler";


/**
 * Generated class for the LookbookPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-lookbook',
  templateUrl: 'lookbook.html'
})
export class LookbookPage {
  mode: any;
  pages: any;
  post: any;
  lookbook: any;

  loading: any;
  alert: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService, private toastCtrl: ToastController, public loadingCtrl: LoadingController, private errorHandler: ErrorHandlerProvider,private alertCtrl:AlertController) {

    //get pages, post and mode to operate in
    console.log("LOOKBOOK");
    this.pages = navParams.get('pages');
    this.mode = navParams.get('mode');
    this.post = navParams.get('post');
    this.dataService.lookbook = this.post;
    this.lookbook = this.post.type;

    //start according to mode
    this.start(this.mode);
    this.helpToast(this.lookbook);



  }

  user :any;
  ionViewDidLoad() {
    console.log('ionViewDidLoad LookbookPage');
 
  }



  start(mode) {

    if (mode == 'view') {
      //view mode
      let post_id = this.post.id;
      //this.dataService.lookbookPages = this.dataService.pages.filter(item => item.inspirationCode == code);
      this.dataService.lookbookPages = this.dataService.findPage("inspiration_id",post_id);
      this.pages = this.dataService.lookbookPages;
      console.log("PAGES",this.pages);

    } else if (mode == 'edit') {
      //admin options
      //edit mode
      this.dataService.lookbookPages = this.pages;

    } else if (mode == 'preview') {

      console.log('preview new lookbook',this.post);
      this.dataService.lookbook = this.post;
      this.dataService.lookbookPages = this.pages;

    }


  }

  helpToast(lookbookType) {
    // show toast depending on lookbook style

    if (lookbookType == 'vertical') {
      this.presentToast('Scroll Up & Down', 'bottom');

    } else if (lookbookType == 'horizontal') {
      this.presentToast('Scroll Sideways', 'middle');
    }

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
            let promises_array:Array<any> = [];
            let that = this;
            for (let page of this.pages) {
              promises_array.push(new Promise(function(resolve,reject) {
                that.dataService.savePageImage(page.code, page.image, "magazine_page"+that.dataService.me.id + "-" + Date.now()).subscribe((data) => {
                  resolve(data);
                }, (err)=> {
                  that.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.image[0].title,ErrorHandlerProvider.MESSAGES.error.image[0].msg);
                });
              }));
            }

            Promise.all(promises_array).then((data)=> {

              this.dataService.saveNewInspiration(this.post, data).subscribe( (data) => {
                this.navCtrl.parent.select(0);
                this.loading.dismissAll();
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
              
            })
          }
          else {
              console.log("NO PAGES");
            this.dataService.saveNewInspiration(this.post, this.pages).subscribe(data => {
              try {
                if(data.status) {
                    console.log(data);
                    this.loading.dismissAll();
                    this.navCtrl.parent.select(0);
                }
                else{
                  this.loading.dismissAll();
                    this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.inspiration[1].title,ErrorHandlerProvider.MESSAGES.error.inspiration[1].msg);
                }

              } catch (error) {
                  this.loading.dismissAll();
                  this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.inspiration[1].title,ErrorHandlerProvider.MESSAGES.error.inspiration[1].msg);
                  console.log('inspiration save error');
              }
            });
            //this.loading.dismissAll();
            //this.navCtrl.parent.select(0);
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

  showLoading(message) {

    this.loading = this.loadingCtrl.create({
      content: message
    });
    this.loading.present();

    /*setTimeout(() => {
      this.loading.dismiss();
    }, 5000);*/


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

}
