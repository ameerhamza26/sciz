import { Injectable } from '@angular/core';

const CONFIG = {
  // apiURL:'http://ec2-18-217-27-194.us-east-2.compute.amazonaws.com/'
  apiURL: 'http://ec2-18-220-1-42.us-east-2.compute.amazonaws.com/',
  apiImageURL: 'http://18.220.1.42/',
  raveURL: 'http://192.168.0.2:4000/',
  stripeURL:'http://192.168.0.2:9000/',
  ravePaymentLinkURL: 'https://rave.flutterwave.com/pay/scizzorapplkv0/',
  stripePK: 'pk_live_9FV6iorOiRugLmRzRP7c715J',
  fcmAuthKey: 'key=AIzaSyBfiliUkfoObqceIrXqd0_9PSS1tLJAIHE'
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

  public getApiImageURL() {
    return CONFIG.apiImageURL;
  }

  public getRaveURL() {
    return CONFIG.raveURL
  }

  public getStripeURL() {
    return CONFIG.stripeURL
  }

  public getRavePaymentLinkURL() {
    return CONFIG.ravePaymentLinkURL
  }

  public getStripePK() {
    return CONFIG.stripePK
  }

  public getFcmAuthKey() {
    return CONFIG.fcmAuthKey
  }

}
