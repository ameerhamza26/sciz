/**
 * Created by mikkytaryan on 10/08/2017.
 */
export class Size {

  constructor(
    public id:any,
    public sizeCode:any,
    public account_id:number,
              public neck:any,
              public shoulder:any,
              public chest:any,
              public waist:any,
              public hip:any,
              public neck_to_waist:any,
              public arm_length:any,
              public waist_to_floor:any,
              public inside_leg:any,
              public lower_leg:any,
              public high_bust:any,
              public bust:any,
              public height:any,
              public weight:any) {

    this.id = id;
    this.sizeCode = sizeCode;
    this.account_id = account_id;
    this.neck = neck;
    this.shoulder = shoulder;
    this.chest = chest;
    this.waist= waist;
    this.hip = hip;
    this.neck_to_waist = neck_to_waist;
    this.arm_length = arm_length;
    this.waist_to_floor = waist_to_floor;
    this.inside_leg = inside_leg;
    this.lower_leg = lower_leg;
    this.high_bust = high_bust;
    this.bust = bust;
    this.height = height;
    this.weight = weight;
  }

}
