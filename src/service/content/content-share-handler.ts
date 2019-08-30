import { Injectable, Inject } from '@angular/core';
import { ContentService, StorageService, ContentExportRequest, ContentExportResponse, Content, Rollup, CorrelationData } from 'sunbird-sdk';
import { CommonUtilService } from '../common-util.service';
import { InteractSubtype, InteractType, Environment, PageId } from '../telemetry-constants';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TelemetryGeneratorService } from '../telemetry-generator.service';
import { ShareUrl, ContentType } from '@app/app';
import { UtilityService } from '../utility-service';

@Injectable()
export class ContentShareHandler {
    constructor(@Inject('CONTENT_SERVICE') private contentService: ContentService,
        @Inject('STORAGE_SERVICE') private storageService: StorageService,
        private commonUtilService: CommonUtilService,
        private social: SocialSharing,
        private telemetryGeneratorService: TelemetryGeneratorService,
        private utilityService: UtilityService) {
    }
    public async shareContent(content: Content, corRelationList?: CorrelationData[], rollup?: Rollup) {
        this.generateShareInteractEvents(InteractType.TOUCH,
            InteractSubtype.SHARE_LIBRARY_INITIATED,
            content.contentData.contentType, corRelationList, rollup);
        const loader = this.commonUtilService.getLoader();
        loader.present();
        const baseUrl = await this.utilityService.getBuildConfigValue('BASE_URL');
        const url = baseUrl + ShareUrl.CONTENT + content.identifier;
        if (content.isAvailableLocally) {
            const exportContentRequest: ContentExportRequest = {
                contentIds: [content.identifier],
                destinationFolder: this.storageService.getStorageDestinationDirectoryPath()
            };
            this.contentService.exportContent(exportContentRequest).toPromise()
                .then((response: ContentExportResponse) => {
                    loader.dismiss();
                    this.generateShareInteractEvents(InteractType.OTHER,
                        InteractSubtype.SHARE_LIBRARY_SUCCESS, content.contentData.contentType, corRelationList, rollup);
                    this.social.share('', '', '' + response.exportedFilePath, url);
                }).catch(() => {
                    loader.dismiss();
                    this.commonUtilService.showToast('SHARE_CONTENT_FAILED');
                });
        } else {
            loader.dismiss();
            this.generateShareInteractEvents(InteractType.OTHER,
                InteractSubtype.SHARE_LIBRARY_SUCCESS,
                content.contentType, corRelationList, rollup);
            this.social.share(null, null, null, url);
        }
    }

    generateShareInteractEvents(interactType, subType, contentType, corRelationList, rollup) {
        const values = new Map();
        values['ContentType'] = contentType;
        this.telemetryGeneratorService.generateInteractTelemetry(interactType,
            subType,
            Environment.HOME,
            this.getPageId(contentType),
            undefined,
            values,
            rollup,
            corRelationList);
    }

    private getPageId(contentType): string {
        let pageId = PageId.CONTENT_DETAIL;
        switch (contentType) {
            case ContentType.COURSE:
                pageId = PageId.COURSE_DETAIL;
                break;
            case ContentType.TEXTBOOK:
                pageId = PageId.COLLECTION_DETAIL;
                break;
            case ContentType.COLLECTION:
                pageId = PageId.COLLECTION_DETAIL;
                break;
        }
        return pageId;
    }

}
