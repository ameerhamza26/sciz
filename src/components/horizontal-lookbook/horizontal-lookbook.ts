import { Component,OnChanges, OnInit, SimpleChanges, Input } from '@angular/core';
import {DataService} from '../../providers/data-service';
import { UserService } from '../../providers/user-service';
import { UserProfilePage } from '../../pages/user-profile/user-profile';
import { NavController  } from 'ionic-angular';
import { ProfilePage } from '../../pages/profile/profile';
import {Like} from "../../models/like-model";
import {Post} from "../../models/post-model";
import {SocialShareProvider} from "../../providers/social-share/social-share";
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the HorizontalLookbookComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'horizontal-lookbook',
  templateUrl: 'horizontal-lookbook.html'
})
export class HorizontalLookbook implements OnInit {

  tags:any;
  name: any;

  @Input()
  user: any;
  loading: any;
  pages: Array<any> = new Array<any>();

  imageBaseUrl = "https://storingimagesandvideos.s3.us-east-2.amazonaws.com/";
  constructor(public dataService:DataService,
    public loadingCtrl: LoadingController,public navCtrl: NavController,private socialShare: SocialShareProvider, public userService:UserService) {
    this.getTags();
  }

  ngOnInit() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait..."
    });

    this.loading.present().then(()=> {
      this.dataService.getUserByCode(this.dataService.lookbook.userCode).subscribe((res)=>{
        if (res.json().data.length>0) {
          this.user = res.json().data[0];
        }
        var ids = [];
        for (let pages of this.dataService.lookbook.pages) {
          ids.push('inspirationpage'+pages.id);
        }
        this.dataService.checkLikedByMe(this.dataService.me.id,ids).subscribe((res)=> {
          let data = res.json().data;
          for (let pages of this.dataService.lookbook.pages ) {
            pages["isLikedByMe"] = false;
            for (let r of data) {
              if (pages.id == r.pageid) {
                pages["isLikedByMe"] = true;
              }
            }
          } 
        })
        this.loading.dismiss();
      })
    });
  }

  ngOnChanges(changes: SimpleChanges) {

  }


  getTags(){
    this.tags  = this.dataService.tags.filter(item => item.inspiration_id == this.dataService.lookbook.code);
  }

  getUser(tag){
    let user = this.dataService.users.filter(item => item.id == tag.userCode)[0];
    return user.name;
  }

  getCreator(code){
    let user = this.dataService.users.filter(item => item.code == code)[0];
    return user.name;
  }

  getImage(tag){
    let user = this.dataService.users.filter(item => item.id == tag.userCode)[0];
    return user.imageUrl;
  }

  getUserImage(code){
    let user = this.dataService.users.filter(item => item.code == code)[0];
    return user.image;
  }

  openProfile(tag){
    //open profile of service
    let user = this.dataService.users.filter(item => item.id == tag.userCode)[0];
    this.navCtrl.push(ProfilePage,{
      userCode:this.user.code,
      view:'service'
    });

  }

  openUserProfile(code){
    //open profile of service
    let user = this.dataService.users.filter(item => item.code == code)[0];

    if (this.userService.user.code == code){
      this.navCtrl.setRoot(UserProfilePage,{
        view:'service'
      });
      this.navCtrl.parent.select(2);
    }

    else {
      this.navCtrl.push(ProfilePage,{
        userCode: this.user.id,
        view:'service'
      });
    }

  }


    checkLiked(){
        // check if you have liked the selected post previously
        this.dataService.lookbookPages.forEach((page, index) => {
            if(this.dataService.likes.filter(item => item.creationCode =='inspirationpage'+page.id).length > 0){
                let reLikedCreation = this.dataService.likes.filter(item => item.creationCode == 'inspirationpage'+page.id)[0];
                page.liked = reLikedCreation.liked;
            }else{
                page.liked = false;
            }
        });
    }

    like(like){
        //like post, add to likes

        let likedCreation = new Like ('',this.dataService.me.id, 'inspirationpage'+like.id,true,like.imageUrl);
        this.dataService.likes.splice(0,0,likedCreation);
        this.dataService.saveLike(likedCreation); 
        like.isLikedByMe = true;

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
