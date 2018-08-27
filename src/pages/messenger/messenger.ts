import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {DataService} from '../../providers/data-service';
import {UserService} from '../../providers/user-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoadingController } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { ToastController } from 'ionic-angular';



/**
 * Generated class for the MessengerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-messenger',
  templateUrl: 'messenger.html',
})
export class MessengerPage {

  itemsSubscription;
  userCode:any;
  user:any;
  provider:any;
  creations:any;
  counter = Array;
  segment:any;
  view:any;
  subscription;
  chatlist: object[] = [];
  listofchats = new Map<string, object []>();
  listofchatsdb = new Map<string, object []>();
  authState: any = null;

  constructor(public afAuth: AngularFireAuth, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, public dataService:DataService, public userService:UserService) {
    this.presentLoading();
    this.presentToast();

    this.user = this.userService.user;
    this.userCode = this.navParams.get('userCode');
    console.log(this.userCode);
    console.log(this.user.id);
    this.view = this.navParams.get('view');

    this.start();

    this.subscription = db.list('/' + 'chats' + '/' + this.user.code);
    this.subscription.subscribe( data => {
      this.chatlist = []
      data.forEach( data => {
        this.listofchatsdb.set(data.$key, data)
        console.log(data)
        console.log(data.$key)
        if ((this.listofchats.get(data.participant) == undefined) && (data.participant != this.user.id)){
          this.listofchats.set(data.participant, data)
        }
        else if ((this.listofchats.get(data.participant) != undefined) && (data.user == this.user.id)){
          this.listofchats.set(data.participant, data)
        }

        else if ((this.listofchats.get(data.user) == undefined) && (data.user != this.user.id)){
          this.listofchats.set(data.user, data)
        }

        else if ((this.listofchats.get(data.user) != undefined) && (data.participant == this.user.id)){
          this.listofchats.set(data.user, data)
        }
      });

      this.listofchats.forEach((value: object [], key: string) => {
        console.log(key, value);
        this.chatlist.push(value)
      });
      //this.chatlist.reverse();
      console.log(this.chatlist)

      this.chatlist = this.chatlist.sort(function(a,b) {
        return new Date((a as any).timestamp).getTime() - new Date((b as any).timestamp).getTime()
      });

      this.chatlist.reverse();

      console.log(this.chatlist)
      //some way to sort based on timestamp
    })

  }

  ionViewDidLoad() {
      this.user = this.userService.user;
      console.log(this.userCode);
      console.log(this.user.id);
    console.log('ionViewDidLoad MessengerPage');

  }

  ionViewWillLeave(){
      this.itemsSubscription.unsubscribe();
  }

  deleteMessage(user,participant) {
    const items = this.db.list('/' + this.user.id);
    this.listofchatsdb.forEach(function(value, key) {
      if ((value as any).participant == participant){
      console.log(key)
      console.log(value)
        items.remove(key)
        }
      });

    for (var i = 0; i < this.chatlist.length; i++) {
      if ((this.chatlist[i] as any).participant === participant) {
        this.chatlist.splice(i,1);
        }
      }
    this.listofchats.delete(participant)
    console.log(this.chatlist)
    }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Swipe left to delete a message',
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Ok"
      });
      toast.present();
    }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 1000
    });
    loader.present();
  }

  start(){
    //load user and their posts from data service

    this.segment = 'work';
    this.user = this.userService.user;
    this.provider =  this.dataService.users.filter(item => item.id == this.user.id)[0];
    this.creations =  this.dataService.creations.filter(item => item.id == this.user.id);

  }

  /*getImage(userCode){

    //should be user.code used not user.name
    //  let tempUser = this.dataService.users.filter(item => item.code == userCode)[0];

    let tempUser = this.dataService.users.filter(item => item.code == userCode)[0];

    return tempUser.image;

  }*/

  openChat(participant, participantID) {
    console.log(participant);
    console.log(participantID);
    this.navCtrl.push(ChatPage,{
      userCode:participantID,
      provider:participantID,
      providername: participant,
      view:'service'
    });
  }

  getAvatar(chat){

    console.log(chat);
  let tempUser = this.dataService.users.filter(item => item.id == chat)[0];
  if(tempUser != undefined)
    return tempUser.image;
  else
    return "";



/*

    let me = this.dataService.me;
    let id = 0;

    if(chat.participant == me.accountID){
      id = chat.user;

    }else{
      id = chat.participant;
    }

    console.log(id)

    console.log(this.dataService.users)


    let tempUser = this.dataService.users.filter(item => item.name == id)[0];

    console.log(tempUser)


    if(tempUser){
      return tempUser.image;
    }else{
      return this.dataService.apiUrl + 'images/' + 'astimlee.png';
    }
*/

  }



}
