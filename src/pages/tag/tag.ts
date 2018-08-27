import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {DataService} from '../../providers/data-service';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

import{Tag} from '../../models/tag-model';
import {ErrorHandlerProvider} from "../../providers/error-handler/error-handler";
/**
 * Generated class for the TagPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tag',
  templateUrl: 'tag.html',
})
export class TagPage {

  searchTerm: string = '';
  filtereditems;
  searchControl: FormControl;
  searching: any = false;
  inspiration:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public dataService:DataService,private alertCtrl: AlertController,private errorHandler: ErrorHandlerProvider) {
    this.searchControl = new FormControl();
    this.inspiration = this.navParams.get('inspiration');
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad TagPage');
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
    this.filtereditems = this.dataService.filter4Tag(this.searchTerm);
    console.log("Tag items,", this.filtereditems);
  }

  tag(user){

    let alert = this.alertCtrl.create({
      title: 'Confirm User',
      message: 'Do you want to Tag ' + user.name,
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
            this.saveTag(user);
          }
        }
      ]
    });
    alert.present();

  }

  saveTag(user){

    let newTag = new Tag(0,this.inspiration.id,user.id);

    this.dataService.tagInspiration(newTag).subscribe(data =>{

      try{
        if(data.message == "Successful"){
          this.dataService.getInspirations();

        }else{
            this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.tag[0].title,ErrorHandlerProvider.MESSAGES.error.tag[0].msg);
          console.log('error saving tag');
        }
      } catch(error){
          this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.tag[0].title,ErrorHandlerProvider.MESSAGES.error.tag[0].msg);
          console.log('error saving tag');
      }



    });


    this.navCtrl.pop();
  }


  makeArray(number){
    return new Array(number)
  }

  close(){
    this.navCtrl.pop();
  }

}
