import { Component, Input, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EnrolledCourseDetailsPage } from '@app/pages/enrolled-course-details';
import {
    ContentType,
    MimeType
} from '@app/app/app.constant';
import { CollectionDetailsEtbPage } from '@app/pages/collection-details-etb/collection-details-etb';
import { ContentDetailsPage } from '@app/pages/content-details/content-details';

@Component({
    selector: 'collection-child',
    templateUrl: 'collection-child.html'
})
export class CollectionChild {

    @Input() childData: any;
    @Input() index: any;
    @Input() depth: any;
    @Input() corRelationList: any;
    @Input() isDepthChild: any;


    constructor(
        private navCtrl: NavController,
        private zone: NgZone,
        private navParams: NavParams
    ) { }

    navigateToDetailsPage(content: any, depth) {
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
}
