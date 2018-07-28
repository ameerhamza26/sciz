import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {DataService} from '../../providers/data-service';
import { CreationPage } from '../creation/creation';
import { ProfilePage } from '../profile/profile';
import { ScizzorSearchPage } from '../scizzor-search/scizzor-search';

/**
 * Generated class for the ScizzorPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-scizzor',
  templateUrl: 'scizzor.html',
})
export class ScizzorPage {


  storeIcons: Array<string> = ['sp-corporate','sp-traditional','sp-streetwear2'];
  serviceIcons: Array<string> = ['sp-tailor','sp-leather','sp-manufacturing'];
  colours: Array<string> = ['black','light','main'];
  colours2: Array<string> = ['black','main','light'];
  storeTypes: Array<string> = ['Corporate','Traditional','Street Wear'];
  stores: Array<string> = ['../assets/images/business4.jpg','../assets/images/african1.jpg','../assets/images/street1.jpg'];
  peopleTypes: Array<string> = ['Tailoring','Leather Work','Manufacturing'];
  people: Array<string> = ['../assets/images/tailoring2.jpg','../assets/images/leather.jpg','../assets/images/manufacturing.png'];

  segment:any;
  showStore:any = false;
  creations:any;
  services:any;
  location:any;
  counter = Array;


  constructor(public navCtrl: NavController, public navParams: NavParams,public dataService:DataService) {
    console.log('hello');
      var is_deeplink = this.navParams.get('is_deeplink');
      var deeplink_creation = this.navParams.get('creation');
      if(is_deeplink && deeplink_creation) {
          this.openCreation(deeplink_creation);
      }
    this.start();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScizzorPage');
  }

  start(){
    //set 1st segment
    this.segment = 'store';
  }

  startSearch() {
    this.navCtrl.push(ScizzorSearchPage,{
      view:'service'
    });
  }



  getAnimation(index){

    // load animations
let animation:any;

 switch (index){
   case 0:
     animation = 'animated slideInLeft';
   break;

   case 1:
     animation = 'animated slideInRight';
     break;

   case 2:
     animation = 'animated slideInLeft';
     break;

 }

    return animation
  }

  openStore(store){

    //change segment, get posts
    this.segment = 'creations';
    this.location = store;
    this.creations =  this.dataService.creations.filter(item => item.type == store);
  }

  openPeople(service){

    //change segment, get services
    this.segment = 'services';
    this.location = service;

    if(service == 'Tailoring'){

      this.services =  this.dataService.users.filter(item => item.type3 == 'Tailor');

    }else if (service == 'Leather Work'){
      this.services =  this.dataService.users.filter(item => item.type3 == 'Shoe Maker');

    }else if (service == 'Manufacturing'){
      this.services =  this.dataService.users.filter(item => item.type2 == 'Manufacturer');
    }


  }

  openCreation(creation2Open){
    //open post
    console.log('open creation: ' + creation2Open);
    this.navCtrl.push(CreationPage,{
      creation : creation2Open
    });



  }

  openProfile(user){
    //open profile of service
    this.navCtrl.push(ProfilePage,{
      userCode:user.code,
      view:'service'
    });




  }

  doRefresh(refresher) {

    //refresh on pull down
    console.log('Begin async operation', refresher);


    this.dataService.reloadCreations().subscribe(data =>{

      for(let creation of data) {

        let image = this.dataService.apiUrl + "images/" + creation.image;
        creation.image = image;
        this.dataService.creations.push(creation);

      }

      this.dataService.reloadUsers().subscribe(data =>{

        for(let user of data) {

          let image = this.dataService.apiUrl + "images/" + user.image;
          user.image = image;
          this.dataService.users.push(user);
        }


        this.reloadPage();

      });



    });

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  reloadPage(){

    //reload all

    if(this.segment == 'creations'){
      this.creations =  this.dataService.creations.filter(item => item.type == this.location);
    }else if(this.segment == 'services'){
      //update people ?

      if(this.location == 'Tailoring'){

        this.services =  this.dataService.users.filter(item => item.type3 == 'Tailor');

      }else if (this.location  == 'Leather Work'){
        this.services =  this.dataService.users.filter(item => item.type3 == 'Shoe Maker');

      }else if (this.location  == 'Manufacturing'){
        this.services =  this.dataService.users.filter(item => item.type2 == 'Manufacturer');
      }

    }


  }

}
