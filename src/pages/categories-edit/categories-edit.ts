import { CommonUtilService } from './../../service/common-util.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-categories-edit',
  templateUrl: 'categories-edit.html',
})
export class CategoriesEditPage {
  syllabusList = [];
  subjectList = [];
  classList = [];
  mediumList = [];

  syllabusOptions = {
    title: this.commonUtilService.translateMessage('BOARD').toLocaleUpperCase(),
    cssClass: 'select-box'
  };
  mediumOptions = {
    title: this.commonUtilService.translateMessage('BOARD').toLocaleUpperCase(),
    cssClass: 'select-box'
  };
  classOptions = {
    title: this.commonUtilService.translateMessage('BOARD').toLocaleUpperCase(),
    cssClass: 'select-box'
  };
  subjectOptions = {
    title: this.commonUtilService.translateMessage('BOARD').toLocaleUpperCase(),
    cssClass: 'select-box'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public commonUtilService: CommonUtilService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesEditPage');
  }

}
