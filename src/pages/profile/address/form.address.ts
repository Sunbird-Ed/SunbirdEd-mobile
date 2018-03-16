import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-address',
  templateUrl: 'form.address.html'
})

export class FormAddress {
  tabBarElement: any;
  isNewForm: boolean = true;
  addressForm: FormGroup;
  constructor(public navCtrl: NavController, public fb: FormBuilder, public navParams: NavParams) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.isNewForm = this.navParams.get('addForm');
    this.addressForm = this.fb.group({
      addressType: [''],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: [''],
      country: [''],
      pinCode: ['']
    });
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }
 
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  onSubmit(event) {
    let formVal = this.addressForm.value;
    console.log("Event", event);
  }

}