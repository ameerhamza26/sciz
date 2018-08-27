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
import {ErrorHandlerProvider} from "../../providers/error-handler/error-handler";
import {Storage} from "@ionic/storage";
import {ProfilePage} from "../profile/profile";
import {ScizzorPage} from "../scizzor/scizzor";


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
  //images = [1,2,3,4,5];
  itemMiddle;


  //itemMiddle = Math.floor(this.dataService.posts.length / 2); //Live magazines
  //itemMiddle = Math.floor(this.images.length / 2); // Test magazines
    postLength;
  timestapm = Date.now();
  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, public dataService: DataService, public modalCtrl: ModalController, private alertCtrl: AlertController, public loadingCtrl: LoadingController,private erroHandler: ErrorHandlerProvider,private storage: Storage,private errorHandler:ErrorHandlerProvider) {

      console.log("INSPIRATION CONSTR",this.dataService.posts);
    //  this.itemMiddle = Math.floor(this.images.length / 2); //Live magazines
     // this.postLength = this.images.length;
  }

    ionViewWillEnter() {
        console.log("ENTER INSPIRATION");
        this.storage.get("branchItem").then(data => {
            if (data) {
                switch (data.type){
                    case 'Profile':
                        var profile =  this.dataService.users.filter(item => item.id == data.type_id)[0];
                        this.navCtrl.push(ProfilePage,{
                            userCode:profile.code,
                            view:'service'
                        });
                        break;
                    case 'Magazine':
                        this.storage.remove("branchItem");
                        var post = this.dataService.findInspiration("id",data.type_id)[0];
                        this.openLookbook(post);
                        break;
                    case 'Item':
                        this.navCtrl.parent.select(1);
                        break;
                    default:
                        this.erroHandler.throwError(ErrorHandlerProvider.MESSAGES.error.branch[0].title,ErrorHandlerProvider.MESSAGES.error.branch[0].msg);
                        break;
                }
            }
        });
    }
  ionViewDidLoad($event) {
    console.log('ionViewDidLoad InspirationPage');

      this.timestapm = Date.now();
      this.dataService.getAllLikes().then((data) => {
        this.dataService.getInspirations();
        setTimeout(()=>{
           // console.log("LALALALALALA")  LIVE ONLY
            this.itemMiddle = Math.floor(this.dataService.posts.length / 2); //Live magazines
            this.postLength = this.dataService.posts.length;
            console.log(this.itemMiddle);
            console.log(this.postLength);
        },5000);
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
    if (this.dataService.permission == 'admin' || this.dataService.me.type2 == "Illustrator" || post.accountCode == this.dataService.me.id) {

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
    console.log(post);
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
      console.log("Edit inspiration");
      console.log(post2Edit);
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
                if(data.status) {
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
                }
                else
                {
                    this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.inspiration[0].title,ErrorHandlerProvider.MESSAGES.error.inspiration[0].msg);
                }
              } catch (error) {
                  this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.inspiration[0].title,ErrorHandlerProvider.MESSAGES.error.inspiration[0].msg);
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
          setTimeout(()=>{
              this.dataService.getInspirationTags();
              // console.log("LALALALALALA")  LIVE ONLY
              this.itemMiddle = Math.floor(this.dataService.posts.length / 2); //Live magazines
              this.postLength = this.dataService.posts.length;
              console.log(this.itemMiddle);
              console.log(this.postLength);
          },5000);
      }).catch((err)=>{
          this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.like[1].title,ErrorHandlerProvider.MESSAGES.error.like[1].msg);
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
