import { Component } from '@angular/core';
import {DataService} from '../../providers/data-service';
import { UserService } from '../../providers/user-service';
import { NavController  } from 'ionic-angular';
import { ProfilePage } from '../../pages/profile/profile';
import { UserProfilePage } from '../../pages/user-profile/user-profile';

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

  constructor(public dataService:DataService, public navCtrl: NavController, public userService:UserService,) {
    console.log('Hello VerticalLookbook Component Component');
    this.text = 'Hello World';
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
