import { Component } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'group-report-list',
  templateUrl: 'group-report-list.html'
})
export class GroupReportListPage {
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  questionResponse = [
        {
            accuracy: '35/50',
            user: 'Some Student',
            qId: 'Q1',
            marks: 5,
            time: '5:21',
            score: '5',
            result: 'pass'
        },
        {
            accuracy: '45/50',
            user: 'Some Student',
            qId: 'Q2',
            marks: 5,
            time: '5:21',
            score: '5',
            result: 'pass'
        },
        {
            accuracy: '35/50',
            user: 'Some Student',
            qId: 'Q3',
            marks: 5,
            time: '5:21',
            score: '5',
            result: 'pass'
        },
        {
            accuracy: '35/50',
            user: 'Some Student',
            qId: 'Q4',
            marks: 5,
            time: '5:21',
            score: '5',
            result: 'failed'
        },
        {
            user: 'Some Student',
            qId: 'Q5',
            marks: 5,
            time: '5:21',
            result: 'failed'
        },
        {
            accuracy: '25/50',
            user: 'Some Student',
            qId: 'Q6',
            marks: 5,
            time: '5:21',
            result: 'pass'
        },
        {
            accuracy: '49/50',
            user: 'Some Student',
            qId: 'Q7',
            marks: 5,
            time: '5:21',
            result: 'pass'
        },
        {
            accuracy: '35/50',
            user: 'Some Student',
            qId: 'Q8',
            marks: 5,
            time: '5:21',
            result: 'failed'
        },
        {
            accuracy: '35/50',
            user: 'Some Student',
            qId: 'Q9',
            marks: 5,
            time: '5:21',
            result: 'failed'
        },
        {
            accuracy: '40/50',
            user: 'Some Student',
            qId: 'Q10',
            marks: 5,
            time: '5:21',
            result: 'pass'
        },
    ];


  constructor(public navCtrl: NavController, public navParams: NavParams, private actionSheetCtrl: ActionSheetController) {
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
  showPopup(){
     
        const actionSheet = this.actionSheetCtrl.create({
          title: 'Modify your album',
          cssClass: 'action-sheets-groups-page',
          buttons: [
            {

              text: 'Destructive',
              role: 'destructive',
              icon: 'close',
           //  icon:'sahdghdg',
              handler: () => {
                console.log('Destructive clicked');
              }
            },{
                icon: 'icon-erase',
              text: 'Archive',
              handler: () => {
                console.log('Archive clicked');
              }
            },
            {
                text: 'Archive',
                icon: 'icon-edition',
                handler: () => {
                  console.log('Archive clicked');
                }
              },
              {
                text: 'Archive',
                icon: 'icon-edition',
   		        cssClass: 'EditionIcon',
                handler: () => {
                  console.log('Archive clicked');
                }
              },{
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]
        });
        actionSheet.present();
      }


}