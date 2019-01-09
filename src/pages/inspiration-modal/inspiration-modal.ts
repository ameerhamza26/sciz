import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-inspiration-modal',
  templateUrl: 'inspiration-modal.html',
})
export class InspirationModalPage {


  constructor(public navCtrl: NavController, private storage: Storage,
    public navParams: NavParams ,public viewCtrl: ViewController, private app: App) {
   

  }





 Go_next(){
    this.storage.set('show_instructions', true);
  this.viewCtrl.dismiss();
  this.app.getRootNav().getActiveChildNav().select(0); 
  } 

 

  
}

