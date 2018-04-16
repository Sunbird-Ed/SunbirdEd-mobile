import { Component, Input } from "@angular/core";
import { NavController } from 'ionic-angular';
import { ImageLoader } from "ionic-image-loader";
import { AnnouncementDetailComponent } from "../../../pages/home/announcement-detail/announcement-detail";

/**
 * The Announcement card component
 */
@Component({
  selector: 'home-announcement-card',
  templateUrl: 'home-announcement-card.html'

})
export class HomeAnnouncementCard {
  /**
   * Contains Announcement list
   */
  @Input() announcement: any;
  /**
   * Contains default image path.
   *
   * It gets used when perticular course does not have a course/content icon
   */
  defaultImg: string;
  rate: string = "4";

  constructor(public navCtrl: NavController) {
    this.defaultImg = 'assets/imgs/ic_action_course.png';
  }

  onImageLoad(imgLoader: ImageLoader) {
    console.log("Image Loader " + imgLoader.nativeAvailable);
  }
  /**
  * Navigate to the Announcement details page
  * 
  * @param {string} id content identifier
  */

  gotoAnnnouncementDetails(announcementId: string) {
    this.navCtrl.push(AnnouncementDetailComponent, { id: announcementId });
  }
}
