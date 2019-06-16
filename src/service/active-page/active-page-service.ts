import { PageId } from '../telemetry-constants';
import { ResourcesPage } from '@app/pages/resources/resources';
import { CoursesPage } from '@app/pages/courses/courses';
import { ProfilePage } from '@app/pages/profile/profile';
import { GuestProfilePage } from '@app/pages/profile';
import { CollectionDetailsEtbPage } from '@app/pages/collection-details-etb/collection-details-etb';
import { ContentDetailsPage } from '@app/pages/content-details/content-details';
import { QrCodeResultPage } from '@app/pages/qr-code-result';
import { CollectionDetailsPage } from '@app/pages/collection-details/collection-details';

export class ActivePageService {

  computePageId(page): string {
    let pageId = '';
    if (page instanceof ResourcesPage) {
      pageId = PageId.LIBRARY;
    } else if (page instanceof CoursesPage) {
      pageId = PageId.COURSES;
    } else if (page instanceof ProfilePage) {
      pageId = PageId.PROFILE;
    } else if (page instanceof GuestProfilePage) {
      pageId = PageId.GUEST_PROFILE;
    } else if (page instanceof CollectionDetailsEtbPage) {
      pageId = PageId.COLLECTION_DETAIL;
    } else if (page instanceof ContentDetailsPage) {
      pageId = PageId.CONTENT_DETAIL;
    } else if (page instanceof QrCodeResultPage) {
      pageId = PageId.DIAL_CODE_SCAN_RESULT;
    } else if (page instanceof CollectionDetailsPage) {
      pageId = PageId.COLLECTION_DETAIL;
    }
    return pageId;
  }

}
