import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthService {
  authState: any = null;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
    });
  }

  /* ANONYMOUSLY LOGIN A USER TO FIREBASE */

  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
     .then((user) => {
       this.authState = user
     })
     .catch(error => console.log(error));
  }

  /* SIGN OUT A LOGGED IN USER */
  signOut(): void {
    this.afAuth.auth.signOut();
  }

}
