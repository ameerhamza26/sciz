import { Component } from '@angular/core';
import { NavController, NavParams  } from 'ionic-angular';
import {DataService} from '../../providers/data-service';
import { CreationPage } from '../creation/creation';
import { ChatPage } from '../chat/chat';


/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  userCode:any;
  user:any;
  creations:any;
  counter = Array;
  segment:any;
  view:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public dataService:DataService) {

    //get usercode to load

    //view = service or user

    this.userCode = this.navParams.get('userCode');
    this.view = this.navParams.get('view');

    this.start();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  start(){

    //load user and their posts from data service

    this.segment = 'work';
    this.user =  this.dataService.users.filter(item => item.code == this.userCode)[0];
    this.creations =  this.dataService.creations.filter(item => item.userCode == this.userCode);


  }

  openCreation(creation2Open){

    //open post

      console.log('open creation: ' + creation2Open);
      this.navCtrl.push(CreationPage,{
        creation : creation2Open
      });



  }

  openChat(participant, participantID) {
    console.log(participant)
    console.log(participantID)
    this.navCtrl.push(ChatPage,{
      provider:participantID,
      providername: participant,
      view:'service'
    });
  }


}
