import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ModalController, AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { LookbookPage } from '../lookbook/lookbook';
import { LookbookLeroyPage } from '../lookbook-leroy/lookbook-leroy';
import { LookbookFlipPage } from '../lookbook-flip/lookbook-flip';
import { CreateNewPage } from '../create-new/create-new';
import { ScizzorSearchPage } from '../scizzor-search/scizzor-search';
import { TagPage } from '../tag/tag';
import { DataService } from '../../providers/data-service';



/**
 * Generated class for the InspirationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 *
 * use data service to access posts
 *
 * selectLookbook(post) if admin prompt admin options, else  openLookbook  (normal user)
 * openLookbook(post) open post
 * deletePost(post2Delete) admin delete post
 */

@Component({
  selector: 'page-inspiration',
  templateUrl: 'inspiration.html',
})
export class InspirationPage {
  timestapm = Date.now();
  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, public dataService: DataService, public modalCtrl: ModalController, private alertCtrl: AlertController, public loadingCtrl: LoadingController) {
      var is_deeplink = this.navParams.get('is_deeplink');
      var deeplink_post = this.navParams.get('post');
      if(is_deeplink && deeplink_post) {
          this.openLookbook(deeplink_post);
      }
  }


  ionViewDidLoad($event) {
    console.log('ionViewDidLoad InspirationPage');
    this.timestapm = Date.now();
      this.dataService.getAllLikes().then((data) => {
        this.dataService.getInspirations();
      })
  }

  getAnimation(post) {
    //get animations for inspirations
    if (post.type == 'vertical') {
      return 'animated bounceInRight';
    } else if (post.type == 'horizontal') {
      return 'animated rollIn';
    } else if (post.type == 'leroy') {
      return 'animated flipInY';
    }
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 1000
    });
    loader.present();
  }

  selectLookbook(post) {

    console.log(post);
    //if admin or owner of post (illustrator) show admin options, else open lookbook to view
    console.log(this.dataService.me.code)
    if (this.dataService.permission == 'admin' || this.dataService.me.type2 == "Illustrator" || post.accountCode == this.dataService.me.code) {

      let actionSheet = this.actionSheetCtrl.create({
        title: 'Modify lookbook',
        buttons: [
          {
            text: 'View',
            handler: () => {
              this.openLookbook(post);
            }
          }, {
            text: 'Edit',
            handler: () => {
              this.editLookbook(post);
            }
          }, {
            text: 'Tag',
            handler: () => {
              this.tagPost(post);
            }
          }, {
            text: 'Delete',
            handler: () => {
              this.deletePost(post);
            }
          }, {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    } else {
      this.openLookbook(post);
    }

  }



  openLookbook(post) {
    //open lookbook according to style -> segue
    console.log('Open Lookbook');
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

  editLookbook(post2Edit) {
    //admin option,  edit selected  lookbook - > segue
    this.navCtrl.setRoot(CreateNewPage, {
      mode: 'edit',
      post: post2Edit
    });
  }

  tagPost(post) {
    let profileModal = this.modalCtrl.create(TagPage, { inspiration: post });
    profileModal.present();
  }

  deletePost(post2Delete) {
    //admin option,  delete selected  lookbook
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you want to Delete this Lookbook',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.dataService.deleteInspiration(post2Delete).subscribe(data => {
              try {
                console.log('inspiration deleted');
                let index = 0;
                for (let post of this.dataService.posts) {
                  if (post2Delete != post) {
                    index = index + 1;
                  } else {
                    this.dataService.posts.splice(index, 1);
                  }
                }
                this.dataService.getInspirations();
              } catch (error) {
                console.log('inspiration delete error');
              }
            });
          }
        }
      ]
    });
    alert.present();
  }
  startSearch() {
    this.navCtrl.push(ScizzorSearchPage, {
      view: 'service'
    });
  }

  doRefresh(refresher) {
    this.timestapm = Date.now();
    console.log('Begin async operation', refresher);
      this.dataService.getAllLikes().then((data)=>{
          this.dataService.getLikes();
          this.dataService.getInspirations();
      })
    /*var getAllLikes = new Promise(function(resolve,reject){
        if(this.dataService.getAllLikes() == true) {
          alert("RESOLVING");
          resolve(true);
        }
    }); */

    /*getAllLikes.then(function(response){
        alert("PROMISE");
        console.log("Get all likes response");
        console.log(response);
    });*/

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }


}
