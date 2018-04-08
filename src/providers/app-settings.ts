import { Injectable } from '@angular/core';

const CONFIG = {
  // apiURL:'http://ec2-18-217-27-194.us-east-2.compute.amazonaws.com/'
  apiURL: 'http://ec2-18-220-1-42.us-east-2.compute.amazonaws.com/'
  // apiURL: 'http://192.168.43.163:9000/'
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

  public getApiURl() {
    return CONFIG.apiURL;
  }

}
