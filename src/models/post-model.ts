/**
 * Created by mikkytaryan on 3/08/2017.
 */
export class Post {

  constructor(
    public id:any,
    public code:string,
    public accountCode:string,
    public title:string,
    public subTitle:string,
    public description:string,
    public image:string,
    public taggedUser:string,
    public type:any) {

    this.id = id;
    this.code = code;
    this.accountCode = accountCode;
    this.title = title;
    this.subTitle = subTitle;
    this.description = description;
    this.image = image;
    this.taggedUser = taggedUser;
    this.type = type;
  }

}
