import { Component , OnInit} from '@angular/core';
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
import { Post } from "../../models/post-model";

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
export class InspirationPage implements OnInit {
  //images = [1,2,3,4,5];
  itemMiddle;

  posts: Array<Post>;

  postLength;
  timestapm = Date.now();

  imageBaseUrl = "https://storingimagesandvideos.s3.us-east-2.amazonaws.com/";
  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, public dataService: DataService, public modalCtrl: ModalController, private alertCtrl: AlertController, 
    public loadingCtrl: LoadingController,private erroHandler: ErrorHandlerProvider,private storage: Storage,private errorHandler:ErrorHandlerProvider) {

      console.log("INSPIRATION CONSTR",this.dataService.posts);
    //  this.itemMiddle = Math.floor(this.images.length / 2); //Live magazines
     // this.postLength = this.images.length;
  }

  ngOnInit() {
    this.getInspirations(null);
  }

  offset = 0;
  limit = 5;
  getInspirations(refresher) {
    this.posts = new Array<Post>();
    this.loading = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.offset = 0;
    this.limit = 4;
    this.loading.present().then(()=> {
      this.dataService.getInspirations(this.offset,this.limit).subscribe((res) => {
        let data = res.json();
        
        for (let inspiration of data.result) {
            let image =  inspiration.image;
            inspiration.image = image;
            inspiration.likes = 0; // magazine likes - random for testing
            inspiration.imageUrl = this.imageBaseUrl + image;
            let likes = 0;
            if (inspiration.pages) {
              for (let pages of inspiration.pages) {
                likes = likes + pages.likes ;
                pages.imageUrl = this.imageBaseUrl + pages.image;
              }
            }
           
            inspiration.totalLikes = likes;
            /* inspirationPages.forEach((page, index) => {
                  pageLikes = this.likes.filter(item => item.creationCode == page.code);
                  console.log("PAGE LIKES");
                  console.log(pageLikes);
                  console.log(pageLikes.length);
                  inspiration.likes = pageLikes.length;
              }); */
            this.posts.push(inspiration);
        }

        this.itemMiddle = Math.floor(this.posts.length / 2); //Live magazines
        this.postLength = this.posts.length;
        this.loading.dismiss();
        if (refresher) {
          refresher.complete();
        }
      })
    });
  }

    ionViewWillEnter() {
        console.log("ENTER INSPIRATION");
        this.storage.get("branchItem").then(data => {
            if (data) {
                console.log("branchitem dataaa",data);
                switch (data.type){
                    case 'Profile':
                        var profile =  this.dataService.users.filter(item => item.id == data.type_id)[0];
                        this.navCtrl.push(ProfilePage,{
                            userCode: data.type_id,
                            view:'service'
                        });
                        break;
                    case 'Magazine':
                        var post =data.custom_object;
                        this.storage.remove("branchItem");
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

  loading :any;
  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 1000
    });
    this.loading.present();
  }

  selectLookbook(post) {
    console.log("post",post)
    console.log("this.dataService.me",this.dataService.me)
    //if admin or owner of post (illustrator) show admin options, else open lookbook to view
    if (this.dataService.permission == 'admin' || (this.dataService.me.type2 == "Illustrator" && +post.userCode == this.dataService.me.id)) {

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


  shareLookBook(post) {
    console.log("post",post);
  }

  openLookbook(post) {
    //open lookbook according to style -> segue
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
                    this.getInspirations(null);
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
    this.showInfinitScroll = true;
    this.getInspirations(refresher);
  }

  showInfinitScroll = true;
  doInfinite(infiniteScroll) {
    this.offset= this.offset + this.limit ;
    setTimeout(() => {
      this.dataService.getInspirations(this.offset,this.limit).subscribe((res) => {
        let data = res.json();
        if (data.result.length ==0) {
          this.showInfinitScroll =false;
        } else {
          for (let inspiration of data.result) {
            let image =  inspiration.image;
            inspiration.image = image;
            inspiration.likes = 0; // magazine likes - random for testing
            inspiration.imageUrl = this.imageBaseUrl + image;
            let likes = 0;
            if (inspiration.pages) {
              for (let pages of inspiration.pages) {
                likes = likes + pages.likes ;
                pages.imageUrl = this.imageBaseUrl + pages.image;
              }
            }
           
            inspiration.totalLikes = likes;
            /* inspirationPages.forEach((page, index) => {
                  pageLikes = this.likes.filter(item => item.creationCode == page.code);
                  console.log("PAGE LIKES");
                  console.log(pageLikes);
                  console.log(pageLikes.length);
                  inspiration.likes = pageLikes.length;
              }); */
            this.posts.push(inspiration);
        }

        this.itemMiddle = Math.floor(this.posts.length / 2); //Live magazines
        this.postLength = this.posts.length;
        }

      })
  
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 1000);
  }


}
