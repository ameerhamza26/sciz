/**
 * Created by mikkytaryan on 6/08/2017.
 */
export class Page {

    public liked = false;
    public imageUrl;
  constructor(public id:any,
              public inspiration_id :number,
              public code:string,
              public image:any
            ) {

    this.id = id;
    this.code = code;
    this.inspiration_id = inspiration_id;
    this.image = image;



  }

}
