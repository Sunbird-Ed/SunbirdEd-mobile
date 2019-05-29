import { Component, NgZone, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import {
   SummarizerService,
   SummaryRequest,
   ReportSummary,
   DeviceInfo
} from 'sunbird-sdk';
import { ReportAlert } from '../report-alert/report-alert';
import { TranslateService } from '@ngx-translate/core';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppVersion } from '@ionic-native/app-version';
import { AppGlobalService, UtilityService, AppHeaderService } from '@app/service';
import { DatePipe } from '@angular/common';
import { CommonUtilService } from '@app/service';
import {
  ImpressionType,
  PageId,
  Environment,
  InteractType,
  InteractSubtype,
} from '../../../service/telemetry-constants';

@IonicPage()
@Component({
  selector: 'page-user-report',
  templateUrl: 'user-report.html',
})
export class UserReportPage {
  profile: any;
  downloadDirectory: string;
  reportSummaryRequest: Partial<ReportSummary>;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    @Inject('SUMMARIZER_SERVICE') public summarizerService: SummarizerService,
    private transfer: FileTransfer,
    private translate: TranslateService,
    private file: File,
    private datePipe: DatePipe,
    private loading: LoadingController,
    private zone: NgZone,
    private appGlobalService: AppGlobalService,
    private appVersion: AppVersion,
    @Inject('DEVICE_INFO') private deviceInfo: DeviceInfo,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private commonUtilService: CommonUtilService,
    private utilityService: UtilityService,
    private headerService: AppHeaderService
    ) {

    this.downloadDirectory = this.file.dataDirectory;
    this.utilityService.getDownloadDirectoryPath()
      .then((response: any) => {
        this.downloadDirectory = response;
      })
      .catch();
  }
  totalScore;
  maxTotalScore;
  totalTime;
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
  handle: string;
  fileTransfer: FileTransferObject = this.transfer.create();
  formatTime(time: number): string {
    const minutes: any = '0' + Math.floor(time / 60);
    const seconds: any = '0' + Math.round(time % 60);
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
    const header = this.headerService.getDefaultPageConfig();
      header.showHeader = false;
      this.headerService.updatePageConfig(header);
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.REPORTS_USER_ASSESMENT_DETAILS,
      Environment.USER
    );

    this.deviceId = this.deviceInfo.getDeviceID();

    this.appVersion.getAppName()
      .then((appName: any) => {
        return appName;
      });
    this.profile = this.appGlobalService.getCurrentUser();
  }
  ionViewWillEnter() {

    const loader = this.loading.create({
      spinner: 'crescent'
    });
    loader.present();

    const that = this;

    this.reportSummaryRequest = this.navParams.get('report');
    this.contentName = this.reportSummaryRequest.name;
    this.handle =  this.navParams.get('handle');
    const summaryRequest: SummaryRequest = {
      qId: '',
      uids: [this.reportSummaryRequest.uid],
      contentId: this.reportSummaryRequest.contentId,
      hierarchyData: null,
  };

    that.summarizerService.getLearnerAssessmentDetails(summaryRequest).toPromise()
    .then(reportList => {
      const data = reportList.get(this.reportSummaryRequest.uid);
      const rows = data.reportDetailsList.map(row => {
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
          that.assessmentData['totalQuestionsScore'] = that.reportSummaryRequest.totalQuestionsScore;
          this.totalScore = data.totalScore;
          this.maxTotalScore = data.maxTotalScore;
          this.totalTime = data.totalTime;
        });
       })
      .catch(err => {
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
    const totalTimespent =  values.totalTimespent;
    const filexptime = this.datePipe.transform(new Date(this.exptime), 'dd-MM-yyyy hh:mm:ss a');
    const contentstarttime = this.datePipe.transform(new Date(teams[0].timestamp), 'dd-MM-yyyy hh:mm:ss a');
    for (let m = 0; m < anzahlTeams; m++) {
      line += 'Device ID' + ',' + this.deviceId + '\n';
      line += 'User name (User ID)' + ',' + this.handle + '(' + this.reportSummaryRequest.uid + ')' + '\n';
      line += 'Content name (Content ID)' + ',' + this.reportSummaryRequest.name + '(' + this.reportSummaryRequest.contentId + ')' + '\n';
      line += 'Content started time' + ',' + contentstarttime + '\n';
      line += 'Total Time' + ',' + this.formatTime(this.totalTime) + '\n';
      line += 'Total Score' + ',' + ' ' + this.totalScore + '/' + this.maxTotalScore  + '\n';
      line += 'File export time' + ',' + filexptime + '\n';
      line += '\n\n';
      line += 'Question#' + ',';
      line += 'QuestionId' + ',';
      line += 'Score' + ',';
      line += 'Time' + '\n';
      break;
    }
    line += '\n';
    for (let j = 0; j < anzahlTeams; j++) {
      line +=  '\"' + values[j].qtitle + '\"' + ',';
      line +=  '\"' + values[j].qid + '\"' + ',';
      line +=  '\"' + ' ' + values[j].score  + '/' + values[j].maxScore + '\"' + ',';
      line +=  '\"' + this.formatTime(values[j].timespent) + '\"' + '\n';
    }
    csv += line + '\n';
    return csv;

  }

  importcsv(body) {
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.DOWNLOAD_REPORT_CLICKED,
      Environment.USER,
      PageId.REPORTS_USER_ASSESMENT_DETAILS, undefined,
      );
    this.exptime = new Date().getTime();
    const csv: any = this.convertToCSV(this.response);
    const combinefilename = this.deviceId + '_' + this.response[0].uid + '_' + this.response[0].contentId + '_' + this.exptime + '.csv';

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

