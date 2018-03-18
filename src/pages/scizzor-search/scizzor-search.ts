import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams   } from 'ionic-angular';
import {DataService} from '../../providers/data-service';
import { ProfilePage } from '../profile/profile';
import { FormControl } from '@angular/forms';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,public dataService:DataService) {
    this.searchControl = new FormControl();
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

        this.filtereditems = this.dataService.filterItems(this.searchTerm);
    }

    openProfile(user){
      //open profile of service
      this.navCtrl.push(ProfilePage,{
        userCode:user.code,
        view:'service'
      });

    }

    makeArray(number){
      return new Array(number)
    }



}