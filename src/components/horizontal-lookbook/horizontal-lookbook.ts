import { Component } from '@angular/core';
import {DataService} from '../../providers/data-service';
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

  constructor(public dataService:DataService,public navCtrl: NavController) {

    this.getTags();
  }

  getTags(){

    this.tags  = this.dataService.tags.filter(item => item.inspirationCode == this.dataService.lookbook.code);

  }

  getUser(tag){
   let user = this.dataService.users.filter(item => item.code == tag.userCode)[0];
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

}
