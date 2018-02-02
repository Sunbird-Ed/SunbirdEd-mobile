import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NavController } from 'ionic-angular';
// import { UserPage } from '../../pages/user/user';

// import { UsernameValidator } from '../../validators/username.validator';
// import { PasswordValidator } from '../../validators/password.validator';
// import { PhoneValidator } from '../../validators/phone.validator';

@Component({
  selector: 'page-education',
  templateUrl: 'form.education.html'
})

export class FormEducation {
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder) { }


  onSubmit(values) {
    // this.navCtrl.push(UserPage);
  }

}