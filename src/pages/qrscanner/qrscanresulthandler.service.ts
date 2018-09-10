import { Injectable } from "@angular/core";
import { TelemetryGeneratorService } from "../../service/telemetry-generator.service";
import { InteractType, InteractSubtype, Environment, PageId, TelemetryObject, Mode, CorrelationData, ContentDetailRequest, ContentService } from "sunbird";
import { Network } from "@ionic-native/network";
import { SearchPage } from "../search/search";
import { ContentType, MimeType } from "../../app/app.constant";
import { EnrolledCourseDetailsPage } from "../enrolled-course-details/enrolled-course-details";
import { ContentDetailsPage } from "../content-details/content-details";
import { CollectionDetailsPage } from "../collection-details/collection-details";
import { CommonUtilService } from "../../service/common-util.service";
import { App } from "ionic-angular";


@Injectable()
export class QRScannerResultHandler {
    private static readonly CORRELATION_TYPE = 'qr';
    source: string;
    constructor(
        private app: App,
        private network: Network,
        private contentService: ContentService,
        private commonUtilService: CommonUtilService,
        private telemetryGeneratorService: TelemetryGeneratorService) {
    }

    isDialCode(scannedData: string): boolean {
        let results = scannedData.split("/");
        let data = results[results.length - 2];
        return data == "dial";
    }

    isContentId(scannedData: string): boolean {
        let results = scannedData.split("/");
        let type = results[results.length - 2];
        let action = results[results.length - 3];
        let scope = results[results.length - 4];
        return (type == "content" && scope == "public") ||
            (action == "play" && (type == "collection" || type == "content")) ||
            (action == "learn" && type == "course")
    }

    handleDialCode(source: string, scannedData: string) {
        this.source = source;
        let results = scannedData.split("/");
        let dialCode = results[results.length - 1];
        this.generateQRScanSuccessInteractEvent(scannedData, "SearchResult", dialCode);
        this.app.getActiveNavs()[0].push(SearchPage, {
            dialCode: dialCode,
            corRelation: this.getCorRelationList(dialCode, QRScannerResultHandler.CORRELATION_TYPE),
            source: this.source,
            shouldGenerateEndTelemetry: true
        });
    }

    handleContentId(source: string, scannedData: string) {
        this.source = source;
        let results = scannedData.split("/");
        let contentId = results[results.length - 1];
        this.generateQRScanSuccessInteractEvent(scannedData, "ContentDetail", contentId);
        let request: ContentDetailRequest = {
            contentId: contentId
        }

        this.contentService.getContentDetail(request, (response) => {
            let data = JSON.parse(response);
            this.navigateToDetailsPage(data.result, this.getCorRelationList(data.result.identifier, QRScannerResultHandler.CORRELATION_TYPE));
        }, (error) => {
                if (this.network.type === 'none') {
                    this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
                }
                else {
                    this.commonUtilService.showToast('UNKNOWN_QR');
                }
            });
    }

    handleInvalidQRCode(source: string, scannedData: string) {
        this.source = source;
        this.generateQRScanSuccessInteractEvent(scannedData, "UNKNOWN", undefined);
        this.generateEndEvent(this.source, scannedData);
    }

    getCorRelationList(identifier: string, type: string): Array<CorrelationData> {
        let corRelationList: Array<CorrelationData> = new Array<CorrelationData>();
        let corRelation: CorrelationData = new CorrelationData();
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
            })
        } else if (content.mimeType === MimeType.COLLECTION) {
            this.app.getActiveNavs()[0].push(CollectionDetailsPage, {
                content: content,
                corRelation: corRelationList,
                source: this.source,
                shouldGenerateEndTelemetry: true

            })
        } else {
            this.app.getActiveNavs()[0].push(ContentDetailsPage, {
                content: content,
                corRelation: corRelationList,
                source: this.source,
                shouldGenerateEndTelemetry: true
            })
        }
    }


    generateQRScanSuccessInteractEvent(scannedData, action, dialCode) {
        let values = new Map();
        values["NetworkAvailable"] = this.network.type === 'none' ? "N" : "Y";
        values["ScannedData"] = scannedData;
        values["Action"] = action;

        let telemetryObject: TelemetryObject = new TelemetryObject();
        if (dialCode) {
            telemetryObject.id = dialCode;
            telemetryObject.type = "qr";
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
            let telemetryObject: TelemetryObject = new TelemetryObject();
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


