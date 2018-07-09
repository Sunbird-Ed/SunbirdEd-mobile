import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { ReportAlert } from '../report-alert/report-alert';

@Component({
  selector: 'report-list',
  templateUrl: 'report-list.html'
})
export class ReportListPage {
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  questionResponse = [
        {
            qId: 'Q1',
            marks: 5,
            time: '5:21',
            result: 'pass'
        },
        {
            qId: 'Q2',
            marks: 5,
            time: '5:21',
            result: 'pass'
        },
        {
            qId: 'Q3',
            marks: 5,
            time: '5:21',
            result: 'pass'
        },
        {
            qId: 'Q4',
            marks: 5,
            time: '5:21',
            result: 'failed'
        },
        {
            qId: 'Q5',
            marks: 5,
            time: '5:21',
            result: 'failed'
        },
        {
            qId: 'Q6',
            marks: 5,
            time: '5:21',
            result: 'pass'
        },
        {
            qId: 'Q7',
            marks: 5,
            time: '5:21',
            result: 'pass'
        },
        {
            qId: 'Q8',
            marks: 5,
            time: '5:21',
            result: 'failed'
        },
        {
            qId: 'Q9',
            marks: 5,
            time: '5:21',
            result: 'failed'
        },
        {
            qId: 'Q10',
            marks: 5,
            time: '5:21',
            result: 'pass'
        },
    ];


  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for(let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(ReportAlert,{}, {
        cssClass: 'report-alert'
    });
    popover.present({
      ev: myEvent,
    });
  }
}