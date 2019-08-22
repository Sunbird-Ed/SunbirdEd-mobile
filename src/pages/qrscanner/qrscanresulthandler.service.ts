import { Inject, Injectable } from '@angular/core';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { Content, ContentDetailRequest, ContentService, CorrelationData, TelemetryObject, TelemetryService } from 'sunbird-sdk';
import { SearchPage } from '../search/search';
import { ContentType, MimeType } from '../../app/app.constant';
import { EnrolledCourseDetailsPage } from '../enrolled-course-details/enrolled-course-details';
import { ContentDetailsPage } from '../content-details/content-details';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { CommonUtilService } from '../../service/common-util.service';
import { App, Events } from 'ionic-angular';
import {
  Environment, ImpressionSubtype, ImpressionType, InteractSubtype, InteractType, Mode, PageId, CorReleationDataType
} from '../../service/telemetry-constants';
import { AppGlobalService } from '@app/service';
import { CertsValidationPage } from '../certs/certsvalidation';
import { SunbirdQRScanner } from './sunbirdqrscanner.service';

declare var cordova;

@Injectable()
export class QRScannerResultHandler {
  private static readonly CORRELATION_TYPE = 'qr';
  source: string;
  inAppBrowserRef: any;

  constructor(
    private app: App,
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
    @Inject('TELEMETRY_SERVICE') private telemetryService: TelemetryService,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private events: Events) {
  }

  isDialCode(scannedData: string): boolean {
    const results = scannedData.split('/');
    const data = results[results.length - 2];
    return data === 'dial';
  }

  isContentId(scannedData: string): boolean {
    const results = scannedData.split('/');
    const type = results[results.length - 2];
    const action = results[results.length - 3];
    const scope = results[results.length - 4];
    return (type === 'content' && scope === 'public') ||
      (action === 'play' && (type === 'collection' || type === 'content')) ||
      (action === 'learn' && type === 'course');
  }

  handleDialCode(source: string, scannedData: string) {
    console.log('appglobal', source);
    this.source = source;
    const results = scannedData.split('/');
    const dialCode = results[results.length - 1];
    this.generateQRScanSuccessInteractEvent(scannedData, 'SearchResult', dialCode);
    this.app.getActiveNavs()[0].push(SearchPage, {
      dialCode: dialCode,
      corRelation: this.getCorRelationList(dialCode, QRScannerResultHandler.CORRELATION_TYPE),
      source: this.source,
      shouldGenerateEndTelemetry: true
    });
  }

  handleContentId(source: string, scannedData: string) {
    this.source = source;
    const results = scannedData.split('/');
    const contentId = results[results.length - 1];
    this.generateQRScanSuccessInteractEvent(scannedData, 'ContentDetail', contentId);
    const request: ContentDetailRequest = {
      contentId: contentId
    };

    this.contentService.getContentDetails(request).toPromise()
      .then((content: Content) => {
        this.navigateToDetailsPage(content,
          this.getCorRelationList(content.identifier, QRScannerResultHandler.CORRELATION_TYPE));
        this.telemetryGeneratorService.generateImpressionTelemetry(
          ImpressionType.SEARCH, '',
          ImpressionSubtype.QR_CODE_VALID,
          PageId.QRCodeScanner,
          Environment.HOME,
        );
      }).catch(() => {
        if (!this.commonUtilService.networkInfo.isNetworkAvailable) {
          this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
        } else {
          this.commonUtilService.showToast('UNKNOWN_QR');
          this.telemetryGeneratorService.generateImpressionTelemetry(
            ImpressionType.SEARCH, '',
            ImpressionSubtype.INVALID_QR_CODE,
            InteractType.OTHER,
            PageId.QRCodeScanner,
            Environment.HOME,
          );
        }
      });
  }

  handleCertsQR(source: string, scannedData: string) {
    this.telemetryService.buildContext().subscribe(context => {
      scannedData = scannedData + '?clientId=android&&context=' + encodeURIComponent(JSON.stringify(context));
      this.inAppBrowserRef = cordova.InAppBrowser.open(scannedData, '_blank', 'zoom=no');
      this.inAppBrowserRef.addEventListener('loadstart', (event) => {
        if (event.url) {
          if (event.url.includes('explore-course')) {
            this.inAppBrowserRef.close();
            this.events.publish('return_course');
          }
        }
      });
    });
  }

  handleInvalidQRCode(source: string, scannedData: string) {
    this.source = source;
    this.generateQRScanSuccessInteractEvent(scannedData, 'UNKNOWN', undefined);
    this.generateEndEvent(this.source, scannedData);
  }

  getCorRelationList(identifier: string, type: string): Array<CorrelationData> {
    const corRelationList: Array<CorrelationData> = new Array<CorrelationData>();
    const corRelation: CorrelationData = new CorrelationData();
    corRelation.id = identifier;
    corRelation.type = type;
    corRelationList.push(corRelation);
    const corRelationftue: CorrelationData = new CorrelationData();
    corRelationftue.type = CorReleationDataType.FTUE;
    corRelationftue.id = this.source === PageId.USER_TYPE_SELECTION ? 'true' : 'false';
    corRelationList.push(corRelationftue);
    return corRelationList;
  }

  navigateToDetailsPage(content, corRelationList) {
    if (content.contentData.contentType === ContentType.COURSE) {
      this.app.getActiveNavs()[0].push(EnrolledCourseDetailsPage, {
        content: content,
        corRelation: corRelationList,
        source: this.source,
        shouldGenerateEndTelemetry: true
      });
    } else if (content.mimeType === MimeType.COLLECTION) {
      this.app.getActiveNavs()[0].push(CollectionDetailsPage, {
        content: content,
        corRelation: corRelationList,
        source: this.source,
        shouldGenerateEndTelemetry: true
      });
    } else {
      this.app.getActiveNavs()[0].push(ContentDetailsPage, {
        content: content,
        corRelation: corRelationList,
        source: this.source,
        shouldGenerateEndTelemetry: true
      });
    }
  }

  generateQRScanSuccessInteractEvent(scannedData, action, dialCode) {
    const values = new Map();
    values['networkAvailable'] = this.commonUtilService.networkInfo.isNetworkAvailable ? 'Y' : 'N';
    values['scannedData'] = scannedData;
    values['action'] = action;
    values['compatibile'] = (action === 'SearchResult' || action === 'ContentDetail') ? 1 : 0;

    let telemetryObject: TelemetryObject;
    if (dialCode) {
      telemetryObject = new TelemetryObject(dialCode, 'qr', undefined);
    }

    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.OTHER,
      InteractSubtype.QRCodeScanSuccess,
      Environment.HOME,
      PageId.QRCodeScanner, telemetryObject,
      values
    );
  }

  generateEndEvent(pageId: string, qrData: string) {
    if (pageId) {
      const telemetryObject = new TelemetryObject(qrData, QRScannerResultHandler.CORRELATION_TYPE, undefined);

      this.telemetryGeneratorService.generateEndTelemetry(
        QRScannerResultHandler.CORRELATION_TYPE,
        Mode.PLAY,
        pageId,
        Environment.HOME,
        telemetryObject
      );
    }
  }

}
