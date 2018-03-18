/**
 * Created by mikkytaryan on 9/08/2017.
 */
export class Creation {

  constructor(
              public id:any,
              public code:any,
              public userCode:string,
              public type:string,
              public image:string,
              public name:string,
              public description:string,
              public availability:boolean,
              public price:any) {

    this.id = id;
    this.code = code;
    this.userCode = userCode;
    this.type = type;
    this.image = image;
    this.name = name;
    this.description = description;
    this.availability = availability;
    this.price = price;

  }

}
