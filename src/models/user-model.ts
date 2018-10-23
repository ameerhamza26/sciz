export class User {
  public imageUrl;
  constructor(public id:any,
              public code:any,
              public type:string,
              public type2:string,
              public type3:string,
              public bankAccountHolder: string,
              public bankAccountNumber: string,
              public bankAccountSortCode : string,
              public image:string,
              public name:string,
              public gender:string,
              public email:string,
              public city:string,
              public phone:string,
              public availability:boolean,
              public description:string,
              public twitter:string,
              public facebook:string,
              public instagram:string,
              public website:string,
              public sizeCode:string,
              public rating:any,
              public password:any) {

    this.id = id;
    this.code = code;
    this.type = type;
    this.type2= type2;
    this.type3= type3;
    this.bankAccountHolder = bankAccountHolder;
    this.bankAccountNumber = bankAccountNumber;
    this.bankAccountSortCode = bankAccountSortCode;
    this.image = image;
    this.name = name;
    this.gender = gender;
    this.email = email;
    this.city = city;
    this.phone = phone;
    this.availability = availability;
    this.description = description;
    this.twitter = twitter;
    this.facebook = facebook;
    this.instagram = instagram;
    this.website = website;
    this.sizeCode = sizeCode;
    this.rating = rating;
    this.password = password;



  }


}
