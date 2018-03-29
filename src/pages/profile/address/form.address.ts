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
  addressDetails: any = {};
  addressForm: FormGroup;
  constructor(public navCtrl: NavController, public fb: FormBuilder, public navParams: NavParams) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.isNewForm = this.navParams.get('addForm') || true;
    this.addressDetails = this.navParams.get('addressDetails') || {};

    this.addressForm = this.fb.group({
      addressType: [(this.addressDetails.addType) ? this.addressDetails.addType : ''],
      addressLine1: [(this.addressDetails.addressLine1) ? this.addressDetails.addressLine1 : '', Validators.required],
      addressLine2: [(this.addressDetails.addressLine2) ? this.addressDetails.addressLine2 : ''],
      city: [(this.addressDetails.city) ? this.addressDetails.city : '', Validators.required],
      state: [(this.addressDetails.state) ? this.addressDetails.state : ''],
      country: [(this.addressDetails.country) ? this.addressDetails.country : ''],
      pinCode: [(this.addressDetails.zipcode) ? this.addressDetails.zipcode : '']
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