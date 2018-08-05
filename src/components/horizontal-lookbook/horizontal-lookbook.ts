import { Component } from '@angular/core';
import {DataService} from '../../providers/data-service';
import { UserService } from '../../providers/user-service';
import { UserProfilePage } from '../../pages/user-profile/user-profile';
import { NavController  } from 'ionic-angular';
import { ProfilePage } from '../../pages/profile/profile';


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

  constructor(public userService:UserService, public dataService:DataService,public navCtrl: NavController) {

    this.getTags();
  }

  getTags(){

    this.tags  = this.dataService.tags.filter(item => item.inspirationCode == this.dataService.lookbook.code);

  }

  getUser(tag){
   let user = this.dataService.users.filter(item => item.code == tag.userCode)[0];
    return user.name;
  }

  getCreator(code){
    let user = this.dataService.users.filter(item => item.code == code)[0];
    return user.name;
  }

  getImage(tag){
    let user = this.dataService.users.filter(item => item.code == tag.userCode)[0];
    return user.image;
  }

  getUserImage(code){
    let user = this.dataService.users.filter(item => item.code == code)[0];
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


}
