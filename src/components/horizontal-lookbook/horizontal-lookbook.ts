import { Component } from '@angular/core';
import {DataService} from '../../providers/data-service';
import { NavController  } from 'ionic-angular';
import { ProfilePage } from '../../pages/profile/profile';
import {Like} from "../../models/like-model";
import {Post} from "../../models/post-model";
import {SocialShareProvider} from "../../providers/social-share/social-share";


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
export class HorizontalLookbook {

  tags:any;

  constructor(public dataService:DataService,public navCtrl: NavController,private socialShare: SocialShareProvider) {

    console.log(dataService.lookbook);
    this.getTags();
    this.checkLiked();
  }

  getTags(){

    this.tags  = this.dataService.tags.filter(item => item.inspirationCode == this.dataService.lookbook.code);
      console.log("TAGOVI",this.tags);
  }

  getUser(tag){
      console.log("USER tag",tag);

      let user = this.dataService.users.filter(item => item.code == tag.userCode)[0];
      console.log(user);
    return user.name;
  }

  getImage(tag){
    let user = this.dataService.users.filter(item => item.code == tag.userCode)[0];
    return user.image;
  }

  openProfile(tag){
    //open profile of service
    let user = this.dataService.users.filter(item => item.code == tag.userCode)[0];
    this.navCtrl.push(ProfilePage,{
      userCode:user.code,
      view:'service'
    });

  }

    checkLiked(){
        // check if you have liked the selected post previously
        console.log(this.dataService.likes);
        this.dataService.lookbookPages.forEach((page, index) => {
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
