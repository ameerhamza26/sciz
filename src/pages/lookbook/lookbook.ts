import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { ToastController } from 'ionic-angular';


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


  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService, private toastCtrl: ToastController, public loadingCtrl: LoadingController, private alertCtrl: AlertController) {

    //get pages, post and mode to operate in

    this.pages = navParams.get('pages');
    this.mode = navParams.get('mode');
    this.post = navParams.get('post');
    this.dataService.lookbook = this.post;
    this.lookbook = this.post.type;

    //start according to mode
    this.start(this.mode);
    this.helpToast(this.lookbook);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LookbookPage');
  }



  start(mode) {

    if (mode == 'view') {
      //view mode
      let code = this.post.code;
      this.dataService.lookbookPages = this.dataService.pages.filter(item => item.inspirationCode == code);
      this.pages = this.dataService.lookbookPages;

    } else if (mode == 'edit') {
      //admin options
      //edit mode
      this.dataService.lookbookPages = this.pages;

    } else if (mode == 'preview') {

      console.log('preview new lookbook');
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

    this.showLoading('Saving ..');
    let i = 0;
    let counter = 0;

    if (this.mode == 'preview') {
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

            this.dataService.saveImage(page.image, page.inspirationCode + i).subscribe(data => {
              console.log(data.message)
              if (data.message == "Successful") {
                counter = counter + 1;
                console.log(this.pages.length)
                console.log(counter)
                //  Logic Need to check why it's hapning
                if (counter == (this.pages.length)) {
                  console.log('all images saved');
                  // this.post.image = this.post.code + '.png';
                  i = 0;
                  for (let page of this.pages) {
                    page.inspirationCode = this.post.code;
                    page.image = page.inspirationCode + i + '.png';
                    i = i + 1;
                  }
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



    //exit segue after save

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

}
