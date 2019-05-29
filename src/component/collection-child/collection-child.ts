import { Component, Input, NgZone, AfterViewInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EnrolledCourseDetailsPage } from '@app/pages/enrolled-course-details';
import {
    ContentType,
    MimeType
} from '@app/app/app.constant';
import { CollectionDetailsEtbPage } from '@app/pages/collection-details-etb/collection-details-etb';
import { ContentDetailsPage } from '@app/pages/content-details/content-details';
import { CommonUtilService } from '@app/service';
import { PopoverController } from 'ionic-angular';
import { SbGenericPopoverComponent } from '../popups/sb-generic-popup/sb-generic-popover';
import {Content} from 'sunbird-sdk';


@Component({
    selector: 'collection-child',
    templateUrl: 'collection-child.html'
})
export class CollectionChildComponent implements AfterViewInit {

    @Input() childData: Content;
    @Input() index: any;
    @Input() depth: any;
    @Input() corRelationList: any;
    @Input() isDepthChild: any;


    constructor(
        private navCtrl: NavController,
        private zone: NgZone,
        private navParams: NavParams,
        private commonUtilService: CommonUtilService,
        private popoverCtrl: PopoverController
    ) { }

    navigateToDetailsPage(content: Content, depth) {
        const stateData = this.navParams.get('contentState');

        this.zone.run(() => {
            if (content.contentType === ContentType.COURSE) {
                this.navCtrl.push(EnrolledCourseDetailsPage, {
                    content: content,
                    depth: depth,
                    contentState: stateData,
                    corRelation: this.corRelationList
                });
            } else if (content.mimeType === MimeType.COLLECTION) {
                this.isDepthChild = true;
                this.navCtrl.push(CollectionDetailsEtbPage, {
                    content: content,
                    depth: depth,
                    contentState: stateData,
                    corRelation: this.corRelationList
                });
            } else {
                this.navCtrl.push(ContentDetailsPage, {
                    isChildContent: true,
                    content: content,
                    depth: depth,
                    contentState: stateData,
                    corRelation: this.corRelationList
                });
            }
        });
    }

    showCommingSoonPopup(childData: any) {
        if (childData.contentData.mimeType === 'application/vnd.ekstep.content-collection' && !childData.children) {
            const popover = this.popoverCtrl.create(SbGenericPopoverComponent, {
                sbPopoverHeading: this.commonUtilService.translateMessage('CONTENT_COMMING_SOON'),
                sbPopoverMainTitle: this.commonUtilService.translateMessage('CONTENT_IS_BEEING_ADDED') + childData.contentData.name,
                actionsButtons: [
                    {
                        btntext: this.commonUtilService.translateMessage('OKAY'),
                        btnClass: 'popover-color'
                    }
                ],
            }, {
                cssClass: 'sb-popover warning',
            });
            popover.present({
                ev: event
            });
        }
    }

    ngAfterViewInit(): void {
    }
}
