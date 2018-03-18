import { Injectable } from '@angular/core';

const CONFIG ={
  apiURL:'http://ec2-18-217-27-194.us-east-2.compute.amazonaws.com/'
};

/*
  Generated class for the AppSettingsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AppSettings {

  constructor() {
    console.log('Hello AppSettingsProvider Provider');
  }

  public getApiURl(){
    return CONFIG.apiURL;
  }

}
