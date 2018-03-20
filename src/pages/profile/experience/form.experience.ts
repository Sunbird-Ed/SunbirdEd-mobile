import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-experience',
  templateUrl: 'form.experience.html'
})

export class FormExperience {
  tabBarElement: any;
  isNewForm: boolean = true;
  jobInfo: any = {};
  experienceForm: FormGroup;
  constructor(public navCtrl: NavController, public fb: FormBuilder, public navParams: NavParams) {
    //Need to hide bottom tab
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.isNewForm = this.navParams.get('addForm');
    this.jobInfo = this.navParams.get('jobInfo');
    this.experienceForm = this.fb.group({
      jobName: [(this.jobInfo.jobName) ? this.jobInfo.jobName : ''],
      org: [(this.jobInfo.orgName) ? this.jobInfo.orgName : '', Validators.required],
      position: [(this.jobInfo.role) ? this.jobInfo.role : ''],
      subjects: [(this.jobInfo.subject) ? this.jobInfo.subject : '', Validators.required],
      isCurrentJob: [''],
      fromDate: [''],
      toDate: ['']
    });
   }

   ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  onSubmit(event) {
    let formVal = this.experienceForm.value;
    console.log("Event", event);
  }


}