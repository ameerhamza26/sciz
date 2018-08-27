import { Component } from '@angular/core';
import {DataService} from '../../providers/data-service';
import { UserService } from '../../providers/user-service';
import { NavController  } from 'ionic-angular';
import { ProfilePage } from '../../pages/profile/profile';
import { UserProfilePage } from '../../pages/user-profile/user-profile';
import {Like} from "../../models/like-model";
import {Creation} from "../../models/creation-model";
import {SocialShareProvider} from "../../providers/social-share/social-share";
import {Post} from "../../models/post-model";

/**
 * Generated class for the VerticalLookbookComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'vertical-lookbook',
  templateUrl: 'vertical-lookbook.html'
})
export class VerticalLookbook {

  text: string;
  tags:any;

  constructor(public dataService:DataService, public navCtrl: NavController,private socialShare: SocialShareProvider, public userService:UserService) {
    console.log('Hello VerticalLookbook Component Component');
    this.text = 'Hello World';
    this.getTags();
    this.checkLiked();
  }

  getTags(){

    this.tags  = this.dataService.tags.filter(item => item.inspiration_id == this.dataService.lookbook.code);
    console.log("TAGOVI",this.tags);

  }
  getUser(tag){

      console.log("USER tag",tag);
    let user = this.dataService.users.filter(item => item.id == tag.userCode)[0];
  console.log(user);
    return user.name;
  }

  getCreator(code){
    let user = this.dataService.users.filter(item => item.code == code)[0];
    return user.name;
  }

  getImage(tag){
    let user = this.dataService.users.filter(item => item.id == tag.userCode)[0];
    console.log("Get tag user image,",user);
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
      userCode:user.code,
      view:'service'
    });

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
        this.dataService.lookbookPages.forEach((page, index) => {
            console.log("PAGE",page);
            if(this.dataService.likes.filter(item => item.creationCode ==  'inspirationpage'+page.id).length > 0){
                let reLikedCreation = this.dataService.likes.filter(item => item.creationCode ==  'inspirationpage'+page.id)[0];
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
