import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams   } from 'ionic-angular';
import {DataService} from '../../providers/data-service';
import { ProfilePage } from '../profile/profile';
import { FormControl } from '@angular/forms';
import { UserProfilePage } from '../user-profile/user-profile';
import 'rxjs/add/operator/debounceTime';

/**
 * Generated class for the ScizzorSearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scizzor-search',
  templateUrl: 'scizzor-search.html',
})
export class ScizzorSearchPage {

  searchTerm: string = '';
  filtereditems;
  searchControl: FormControl;
  searching: any = false;
  user:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public dataService:DataService) {
    this.searchControl = new FormControl();
    this.user = this.dataService.me;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScizzorSearchPage');
    this.setFilteredItems();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
        });
  }

  onSearchInput(){
        this.searching = true;
    }

  setFilteredItems() {
      this.dataService.getUsers().subscribe((res)=>{
        this.filtereditems = res.json().result;
      })
    }

    openProfile(user){

      console.log("user",user, this.dataService.me); 
      if (this.dataService.me.id == user.id) {
        this.navCtrl.parent.select(2); 
      } else {
        if (user.type == 'customer') {
          this.navCtrl.push(UserProfilePage,{
            user:user,
            view:'customer'
          });
        }
        else {
          this.navCtrl.push(ProfilePage,{
            userCode:user.id,
            view:'service'
          });
        }
      }
    }

    makeArray(number){
      return new Array(number)
    }
}
