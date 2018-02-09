import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-experience',
  templateUrl: 'form.experience.html'
})

export class FormExperience {
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder) { }


  onSubmit(values) {
    // this.navCtrl.push(UserPage);
  }

}