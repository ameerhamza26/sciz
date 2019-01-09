import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { UserService } from '../user-service';
import {DataService} from '../data-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../app/auth.service'

@Injectable()
export class FcmProvider {

  user:any;
  subscription;

  constructor(public db: AngularFireDatabase, private platform: Platform, public userService:UserService, public dataService: DataService, public auth: AuthService) {
  }

  //Get token from db
  getToken(userId) {

    //this.subscription = this.db.list('/' + 'devices' + '/' + userId);
    //this.subscription.subscribe(snapshots => {
    //  console.log(snapshots[0].$value)
    //})

  }

  saveToken(userId, token) {
    this.db.object('/' + 'devices' + '/' + userId).set({
      token: token
    }).then( () => {
      //message successfully sent
    }).catch( () => {
    //some error and the message wasn't sent
    });
  }
}
