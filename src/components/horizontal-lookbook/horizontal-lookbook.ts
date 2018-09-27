import { Component,OnChanges, OnInit, SimpleChanges, Input } from '@angular/core';
import {DataService} from '../../providers/data-service';
import { UserService } from '../../providers/user-service';
import { UserProfilePage } from '../../pages/user-profile/user-profile';
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
export class HorizontalLookbook implements OnInit {

  tags:any;
  name: any;

  @Input()
  user: any;
  constructor(public dataService:DataService,public navCtrl: NavController,private socialShare: SocialShareProvider, public userService:UserService) {



  
    this.getTags();
    this.checkLiked();
  }

  ngOnInit() {
    
    //this.showLoading("Please wait.");
    this.dataService.getUserByCode(this.dataService.lookbook.userCode).subscribe((res)=>{
      console.log("user component is",res);
      if (res.data.length>0) {
        this.user = res.data[0];
      }
     // this.loading.dismissAll();
    })
  }

  ngOnChanges(changes: SimpleChanges) {

  }


  getTags(){
    //console.log("console.log(this.dataService.tags);",this.dataService.tags);
    this.tags  = this.dataService.tags.filter(item => item.inspiration_id == this.dataService.lookbook.code);
    
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
    //open profile of service
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
            if(this.dataService.likes.filter(item => item.creationCode =='inspirationpage'+page.id).length > 0){
                let reLikedCreation = this.dataService.likes.filter(item => item.creationCode == 'inspirationpage'+page.id)[0];
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
