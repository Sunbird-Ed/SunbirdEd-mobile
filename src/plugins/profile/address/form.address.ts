import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-address',
  templateUrl: 'form.address.html'
})

export class FormAddress {
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder) { }


  onSubmit(values) {
    // this.navCtrl.push(UserPage);
  }

}