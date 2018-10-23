import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Platform, ActionSheetController, ModalController, AlertController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Page } from '../../models/page';
import { Post } from '../../models/post-model';
import { DataService } from '../../providers/data-service';

import { LookbookPage } from '../lookbook/lookbook';
import { LookbookLeroyPage } from '../lookbook-leroy/lookbook-leroy';
import { LookbookFlipPage } from '../lookbook-flip/lookbook-flip';
import { TagPage } from '../tag/tag';
import {ErrorHandlerProvider} from "../../providers/error-handler/error-handler";

/**
 * Generated class for the CreateNewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 *
 * createNewPost() generate code and start process
 * getPicture(post/page object) from source or camera
 * takePicture(sourceType,post/page object) grab picture and present
 * preview() preview lookbook depending on what lookbook style choosen
 * showPage(page) expand/open/close Page
 * add() add page
 * minus() delete page
 * savePost() set user input to post object before preview
 * presentToast(text) show Toast
 * goBack() go back
 */

@Component({
  selector: 'page-create-new',
  templateUrl: 'create-new.html',
})
export class CreateNewPage {

  pictureAdded: boolean = false;
  pageCount = 0;

  pages: Array<Page> = new Array<Page>();
  temp: Array<string> = ['images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg', 'images/5.jpg'];

  create: any = false;
  code: any;
  who: any = "";
  title: any = "";
  subTitle: any = "";
  description: any = "";
  lookbook: any = "";
  index: any;
  post: any;

  selectedRecord: any;
  mode: any;



  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, private camera: Camera, public dataService: DataService, public modalCtrl: ModalController, private alertCtrl: AlertController,private errorHandler: ErrorHandlerProvider) {

    if (this.navParams.get('mode') == 'edit') {
      //if edit mode then setup edit, get passed post
      this.post = this.navParams.get('post');
      this.mode = "edit"
      this.setupEdit();
      console.log(this.pages)
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateNewPage');
  }

  start() {

    // create new clicked , create new inspiration
    this.create = true;
    this.createNewPost();

  }

  setupEdit() {

    //setup edit fields, load post
    this.create = true;
    this.mode = 'edit';

    this.getPages();

    this.title = this.post.title;
    this.subTitle = this.post.subTitle;
    this.description = this.post.description;
    this.lookbook = this.post.type;
  }

  getPages() {
    //load pages from data service
   // this.pages = this.dataService.pages.filter(item => item.inspirationCode == this.post.code);
    this.pages = this.dataService.findPage("inspiration_id",this.post.id);
    this.pages["pagesRemoved"] = new Array<Page>();
  }

  createNewPost() {

    //generate new code for inspiration post
    //create new empty post

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 40; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    this.code = 'inspiration' + text;

    this.post = new Post(0, this.code, this.dataService.me.id, '', '', '', '', 0, '');
    this.post.imageUrl = "";
  }

  getPicture(newPost) {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, newPost);

          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, newPost);

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

  takePicture(sourceType, newPost) {
    let tempImage: any;
    // Get the data of an image
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      quality: 70
    }).then((imageData) => {
      // imageData is a base64 encoded string
      tempImage = "data:image/jpeg;base64," + imageData;
      tempImage = tempImage.replace(/(\r\n|\n|\r)/gm, "");
      newPost.image = tempImage;
      newPost.imageUrl = tempImage;
      //newPost.image = 'images/1.jpg';
      this.pictureAdded = true;
    }, (err) => {
      this.pictureAdded = false;
      this.presentToast('Error while selecting image.');
    });


  }


  preview() {
    //preview inspiration, send post to whateva lookbook style is selected
    this.savePost();
    console.log('preview page', this.post);
    console.log('open ' + this.lookbook);
    var modesection = this.mode;
    console.log(this.pages)
    if (this.lookbook == 'vertical' || this.lookbook == 'horizontal') {
      this.navCtrl.push(LookbookPage, {
        mode: (modesection == 'edit') ? 'edit' : 'preview',
        pages: this.pages,
        post: this.post
      });
    } else if (this.lookbook == 'leroy') {
      this.navCtrl.push(LookbookLeroyPage, {
        mode: (modesection == 'edit') ? 'edit' : 'preview',
        pages: this.pages,
        post: this.post
      });
    } else if (this.lookbook == 'flip') {
      this.navCtrl.push(LookbookFlipPage, {
        mode: (modesection == 'edit') ? 'edit' : 'preview',
        pages: this.pages,
        post: this.post
      });
    }
  }

  showPage(selected) {
    //expand page view
    if (this.selectedRecord == selected) {
      this.selectedRecord = null;
    } else {
      this.selectedRecord = selected;
    }

  }

  add() {
    // add page to inspiration
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 40; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      let pagecode = 'inspirationpage' + text;
  //  let tempPage = new Page('', this.code,pagecode, 'images/image.png');
    let tempPage = new Page('', this.post.id, "",'inspirationrotIf0giEtlnOmsdZZBBnUWK8FY7gCzRDJW2Uui71.png'); // debug
      tempPage.imageUrl = "";
      this.pages.push(tempPage);
  }
  minus(index) {
    //delete page from inspiration
      //this.pages["pagesRemoved"].push(this.pages[index]);
      //this.pagesRemoved.push(this.pages[index]);

    this.pages.splice(index, 1);
  }

  savePost() {
    // save post fields into post object
   // this.post.image = "inspirationXOaXhtOaEQ0eyzoSnqTFCB8jPtLZ76H1nAvREIsP.png"; // debug
    this.post.title = this.title;
    this.post.subTitle = this.subTitle;
    this.post.description = this.description;
    this.post.type = this.lookbook;
    this.post.pages = this.pages;
    console.log(this.post);
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


  selectLookbook(post) {
    //if admin or owner of post (illustrator) show admin options, else open lookbook to view
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
    // tag post, bring up modal
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
                    this.dataService.getInspirations(0,5);
                }
                else
                {
                    this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.inspiration[0].title,ErrorHandlerProvider.MESSAGES.error.inspiration[0].msg);
                }
              } catch (error) {
                  this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.inspiration[0].title,ErrorHandlerProvider.MESSAGES.error.inspiration[0].msg);
                  console.log('inspiration delete error');
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

  goBack() {
    this.create = false;
  }



}
