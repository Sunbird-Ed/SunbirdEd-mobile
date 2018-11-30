import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ReportService, ReportSummary, ImpressionType, PageId, Environment, DeviceInfoService } from 'sunbird';
import { ReportAlert } from '../report-alert/report-alert';
import { TranslateService } from '@ngx-translate/core';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppVersion } from '@ionic-native/app-version';
import { url } from 'inspector';
import { error } from 'util';
import { AppGlobalService } from '../../../service/app-global.service';
import { DatePipe } from '@angular/common';
import { CommonUtilService } from '@app/service';

@IonicPage()
@Component({
  selector: 'page-user-report',
  templateUrl: 'user-report.html',
})
export class UserReportPage {
  profile: any;
  downloadDirectory: string;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private reportService: ReportService,
    private transfer: FileTransfer,
    private translate: TranslateService,
    private file: File,
    private datePipe: DatePipe,
    private loading: LoadingController,
    private zone: NgZone,
    private appGlobalService: AppGlobalService,
    private appVersion: AppVersion,
    private deviceInfoService: DeviceInfoService,
    private socialShare: SocialSharing,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private commonUtilService: CommonUtilService) {

    this.downloadDirectory = this.file.dataDirectory;
    this.deviceInfoService.getDownloadDirectoryPath()
      .then((response: any) => {
        this.downloadDirectory = response;
      })
      .catch();
  }
  assessmentData;
  columns = [
    {
      name: this.translateMessage('QUESTION_MARKS'),
      prop: 'index'
    }, {
      name: this.translateMessage('TIME'),
      prop: 'timespent'
    }, {
      name: this.translateMessage('RESULT'),
      prop: 'result'
    }
  ];
  contentName: string;
  deviceId: string;
  version: string;
  fileUrl: string;
  exptime: any;
  response: any;
  fileTransfer: FileTransferObject = this.transfer.create();
  formatTime(time: number): string {
    const minutes: any = '0' + Math.floor(time / 60);
    const seconds: any = '0' + (time - minutes * 60);
    return minutes.substr(-2) + ':' + seconds.substr(-2);
  }

  translateMessage(messageConst: string, field?: string): string {
    let translatedMsg = '';
    this.translate.get(messageConst, { '%s': field }).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }

  ionViewDidLoad() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.REPORTS_USER_ASSESMENT_DETAILS,
      Environment.USER
    );
    this.deviceInfoService.getDeviceID()
      .then((res: any) => {
        console.log('Device Id: ', res);
        this.deviceId = res;
      })
      .catch((err: any) => {
        console.error('Error', err);
      });
    this.appVersion.getAppName()
      .then((appName: any) => {
        return appName;
      });
    this.profile = this.appGlobalService.getCurrentUser();
    console.log(this.profile);
  }
  ionViewWillEnter() {

    const loader = this.loading.create({
      spinner: 'crescent'
    });
    loader.present();

    const that = this;

    const reportSummary: ReportSummary = this.navParams.get('report');
    this.contentName = reportSummary.name;

    that.reportService.getDetailReport([reportSummary.uid], reportSummary.contentId)
      .then(reportsMap => {
        const data = reportsMap.get(reportSummary.uid);
        const rows = data.reportDetailsList.map(row => {
          console.log(data.reportDetailsList);
          this.response = data.reportDetailsList;
          return {
            'index': 'Q' + (('00' + row.qindex).slice(-3)),
            'result': row.score + '/' + row.maxScore,
            'timespent': that.formatTime(row.timespent),
            'qdesc': row.qdesc,
            'score': row.score,
            'maxScore': row.maxScore,
            'qtitle': row.qtitle,
            'qid': row.qid
          };
        });
        data['uiRows'] = rows;
        data['uiTotalTime'] = that.formatTime(data['totalTime']);
        data['fromUser'] = true;
        data['fromGroup'] = false;
        that.zone.run(() => {
          loader.dismiss();
          data['showResult'] = true;
          that.assessmentData = data;
          that.assessmentData['showPopup'] = true;
          that.assessmentData['popupCallback'] = ReportAlert;
        });
      })
      .catch(err => {
        console.log(err);
        loader.dismiss();
      });

  }

  goBack() {
    this.navCtrl.pop();
  }
  convertToCSV(teams) {
    let csv: any = '';
    let line: any = '';
    const that = this;
    const values = this.response;
    const anzahlTeams = values.length;

    const filexptime = this.datePipe.transform(new Date(this.exptime), 'dd-MMM-yyyy hh:mm:ss a');
    const contentstarttime = this.datePipe.transform(new Date(teams[0].timestamp), 'dd-MMM-yyyy hh:mm:ss a');
    // Header
    for (let m = 0; m < anzahlTeams; m++) {
      line += 'Device ID' + '\t' + this.deviceId + '\n';
      line += 'User name (User ID)' + '\t' + this.profile.handle + this.profile.uid + '\n';
      line += 'Content name (Content ID)' + '\t' + teams[0].qtitle + teams[0].contentId + '\n';
      line += 'Content started time' + '\t' + contentstarttime + '\n';
      line += 'File export time' + '\t' + filexptime + '\n';
      line += '\n\n';
      line += 'Question' + '\t\t';
      line += 'QuestionId' + '\t\t';
      line += 'Score' + '\t\t';
      line += 'Time' + '\n';
      break;
    }
    line += '\n';
    for (let j = 0; j < anzahlTeams - 1; j++) {
      line += values[j].qtitle + '\t\t';
      line += values[j].qid + '\t\t';
      line += values[j].score + '/' + values[j].maxScore + '\t\t';
      line += that.formatTime(values[j].timespent) + '\n';
    }
    csv += line + '\n';
    return csv;

  }

  importcsv(body) {
    this.exptime = new Date().getTime();
    const csv: any = this.convertToCSV(this.response);
    const combinefilename = this.deviceId + '_' + this.response[0].uid  + '_' + this.response[0].contentId + '_' + this.exptime + '.csv';

    this.downloadDirectory = 'file:///storage/emulated/0/Download/';
    this.file.writeFile(this.downloadDirectory, combinefilename, csv)
      .then(
        _ => {
          this.commonUtilService.showToast(this.translateMessage('CSV_DOWNLOAD_SUCCESS', combinefilename), false, 'custom-toast');
        }
      )
      .catch(
        err => {
          this.file.writeExistingFile(this.downloadDirectory, combinefilename, csv)
            .then(
              _ => {
                 this.commonUtilService.showToast(this.translateMessage('CSV_DOWNLOAD_SUCCESS', combinefilename), false, 'custom-toast');
              }
            )
            .catch();
        }
      );
  }
}

