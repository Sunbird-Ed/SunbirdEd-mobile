import { Injectable, Inject } from '@angular/core';
import { ContentService, InteractType, Content, ContentDeleteStatus } from 'sunbird-sdk';
import { TelemetryGeneratorService } from '../telemetry-generator.service';
import { InteractSubtype, Environment, PageId, ImpressionType, ImpressionSubtype } from '../telemetry-constants';
import { CommonUtilService } from '../common-util.service';
import { FileSizePipe } from '@app/pipes/file-size/file-size';
import { ContentInfo } from './content-info';
import { SbPopoverComponent } from '@app/component';
import { PopoverController, Events } from 'ionic-angular';
import { Subject } from 'rxjs';

@Injectable()
export class ContentDeleteHandler {
    private contentDelete = new Subject<any>();
    public contentDeleteCompleted$ = this.contentDelete.asObservable();

    constructor(@Inject('CONTENT_SERVICE') private contentService: ContentService,
        private telemetryGeneratorService: TelemetryGeneratorService,
        private commonUtilService: CommonUtilService,
        private fileSizePipe: FileSizePipe,
        private popoverCtrl: PopoverController,
        private events: Events) {
    }

    /**
     * Shows Content Delete popup
     *  @param {Content} content
     *  @param {boolean} isChildContent
     *  @param {ContentInfo} contentInfo
     *  @param {string} pageId
     *  @returns {void}
     */
    public showContentDeletePopup(content: Content, isChildContent: boolean, contentInfo: ContentInfo, pageId: string) {
        this.telemetryGeneratorService.generateImpressionTelemetry(ImpressionType.VIEW, pageId,
            PageId.SINGLE_DELETE_CONFIRMATION_POPUP,
            Environment.HOME,
            contentInfo.telemetryObject.id,
            contentInfo.telemetryObject.type,
            contentInfo.telemetryObject.version,
            contentInfo.rollUp,
            contentInfo.correlationList);
        const confirm = this.popoverCtrl.create(SbPopoverComponent, {
            content: content,
            isChild: isChildContent,
            objRollup: contentInfo.rollUp,
            pageName: PageId.CONTENT_DETAIL,
            corRelationList: contentInfo.correlationList,
            sbPopoverHeading: this.commonUtilService.translateMessage('DELETE'),
            sbPopoverMainTitle: this.commonUtilService.translateMessage('CONTENT_DELETE'),
            actionsButtons: [
                {
                    btntext: this.commonUtilService.translateMessage('REMOVE'),
                    btnClass: 'popover-color'
                },
            ],
            icon: null,
            metaInfo: content.contentData.name,
            sbPopoverContent: ' 1 item' + ' (' + this.fileSizePipe.transform(content.sizeOnDevice, 2) + ')',
        }, {
                cssClass: 'sb-popover danger',
            });
        confirm.present({
            ev: event
        });
        confirm.onDidDismiss((canDelete: any) => {
            if (canDelete) {
                this.deleteContent(content.identifier, isChildContent, contentInfo, pageId);
            }
        });
    }

    /**
     * Deletes the content
     *  @param {string} identifier
     *  @param {boolean} isChildContent
     *  @param {ContentInfo} contentInfo
     *  @param {string} pageId
     *  @returns {void}
     */
    private deleteContent(identifier: string, isChildContent: boolean, contentInfo: ContentInfo, pageId: string) {
        this.telemetryGeneratorService.generateInteractTelemetry(
            InteractType.TOUCH,
            InteractSubtype.DELETE_CLICKED,
            Environment.HOME,
            pageId,
            contentInfo.telemetryObject,
            undefined,
            contentInfo.rollUp,
            contentInfo.correlationList);
        const deleteContentRequest = {
            contentDeleteList: [{
                contentId: identifier,
                isChildContent: isChildContent
            }]
        };
        const loader = this.commonUtilService.getLoader();
        loader.present();
        this.contentService.deleteContent(deleteContentRequest).toPromise().then((res: any) => {
            loader.dismiss();
            if (res && res.status === ContentDeleteStatus.NOT_FOUND) {
                this.commonUtilService.showToast('CONTENT_DELETE_FAILED');
            } else {
                // Publish saved resources update event
                this.events.publish('savedResources:update', {
                    update: true
                });
                this.contentDelete.next();
                this.commonUtilService.showToast('MSG_RESOURCE_DELETED');
            }
        }).catch((error: any) => {
            loader.dismiss();
            console.log('delete response: ', error);
            this.commonUtilService.showToast('CONTENT_DELETE_FAILED');
        });
    }
}
