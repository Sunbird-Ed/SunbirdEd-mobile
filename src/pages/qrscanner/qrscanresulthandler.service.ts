import { Injectable } from '@angular/core';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import {
    InteractType,
    InteractSubtype,
    Environment,
    PageId,
    TelemetryObject,
    Mode,
    CorrelationData,
    ContentDetailRequest,
    ContentService,
    ImpressionType,
    ImpressionSubtype
} from 'sunbird';
import { SearchPage } from '../search/search';
import {
    ContentType,
    MimeType
} from '../../app/app.constant';
import { EnrolledCourseDetailsPage } from '../enrolled-course-details/enrolled-course-details';
import { ContentDetailsPage } from '../content-details/content-details';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { CommonUtilService } from '../../service/common-util.service';
import { App } from 'ionic-angular';

@Injectable()
export class QRScannerResultHandler {
    private static readonly CORRELATION_TYPE = 'qr';
    source: string;
    constructor(
        private app: App,
        private contentService: ContentService,
        private commonUtilService: CommonUtilService,
        private telemetryGeneratorService: TelemetryGeneratorService) {
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

        this.contentService.getContentDetail(request)
        .then((response: any) => {
            const data = JSON.parse(response);
            this.navigateToDetailsPage(data.result,
                this.getCorRelationList(data.result.identifier, QRScannerResultHandler.CORRELATION_TYPE));
                this.telemetryGeneratorService.generateImpressionTelemetry(
                    ImpressionType.SEARCH, '',
                    ImpressionSubtype.QR_CODE_VALID,
                    PageId.QRCodeScanner,
                    Environment.HOME,
                );
        }) .catch((error) => {
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

        const telemetryObject: TelemetryObject = new TelemetryObject();
        if (dialCode) {
            telemetryObject.id = dialCode;
            telemetryObject.type = 'qr';
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
            const telemetryObject: TelemetryObject = new TelemetryObject();
            telemetryObject.id = qrData;
            telemetryObject.type = QRScannerResultHandler.CORRELATION_TYPE;
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
