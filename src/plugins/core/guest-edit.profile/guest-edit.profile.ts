import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-guest-edit.profile',
  templateUrl: 'guest-edit.profile.html'
})

export class GuestEditProfilePage {

  // languages: any[];
  zone: any = {
    kind: 'key2'
  }
  modeKeys: any = [
    'key1',
    'key2',
    'key3',
    'key4',
  ]

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder) { }


  onSubmit(values) {
    // this.navCtrl.push(UserPage);
  }

//   loadData() {
//   this.yourService.getData().subscribe((data) => {
//     console.log("what is in the data ", data);
//     this.myjsondata = data;
//   });
// }

}