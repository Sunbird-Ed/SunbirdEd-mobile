import { NavController, Slides, PopoverController, Events, Platform, ToastController } from 'ionic-angular';
import { Component, ViewChild, NgZone } from '@angular/core';
import { FormAndFrameworkUtilService } from "../../pages/profile/formandframeworkutil.service";

@Component({
  selector: 'info-card',
  templateUrl: 'info-card.html'
})
export class InfoCard {

  slideData: Array<any> = [
    {
        'id': 'syllabusList',
        'title': 'SYLLABUS_QUESTION',
        'desc': 'SYLLABUS_OPTION_TEXT',
        'options': [],
        'selectedOptions': '',
        'selectedCode': []
    },
    {
        'id': 'boardList',
        'title': 'BOARD_QUESTION',
        'desc': 'BOARD_OPTION_TEXT',
        'options': [],
        'selectedOptions': '',
        'selectedCode': []
    },
    {
        'id': 'mediumList',
        'title': 'MEDIUM_QUESTION',
        'desc': 'MEDIUM_OPTION_TEXT',
        'options': [],
        'selectedOptions': '',
        'selectedCode': []
    },
    {
        'id': 'gradeList',
        'title': 'GRADE_QUESTION',
        'desc': 'GRADE_OPTION_TEXT',
        'options': [],
        'selectedOptions': '',
        'selectedCode': []
    },
    {
        'id': 'subjectList',
        'title': 'SUBJECT_QUESTION',
        'desc': 'SUBJECT_OPTION_TEXT',
        'options': [],
        'selectedOptions': '',
        'selectedCode': []
    }
  ];

  constructor(
    public navCtrl: NavController,
    private popupCtrl: PopoverController,
    private events: Events,
    private zone: NgZone,
    private toastCtrl: ToastController,
    private formService: FormAndFrameworkUtilService
  ) {

    this.formService.getSyllabusList()
    .then(syllabusList => {
        
    })
    .catch();

  }


}
