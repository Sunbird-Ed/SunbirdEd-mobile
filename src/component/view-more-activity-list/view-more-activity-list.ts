import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { ImageLoader } from "ionic-image-loader";

/**
 * Generated class for the ViewMoreActivityListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'view-more-activity-list',
  templateUrl: 'view-more-activity-list.html'
})
export class ViewMoreActivityListComponent {

  /**
   * Contains content details
   */
  @Input() content: any;

  /**
   * Page name
   */
  @Input() type: string;

  /**
   * Contains default image path.
   * 
   * Get used when content / course does not have appIcon or courseLogo
   */
  defaultImg: string;

  /**
   * Default method of cass SearchListComponent
   */
  constructor() {
    console.log('Hello SearchListComponent Component');
    /*if (this.content && this.content.appIcon) {
      console.log('Inside content.appIcon =>>', this.content.appIcon);
      this.defaultImg = this.content.appIcon;
    } else if (this.content && this.content.courseLogoUrl) {
      this.defaultImg = this.content.courseLogoUrl;
      console.log('Inside content.courseLogoUrl =>>', this.content.courseLogoUrl);
    } else {
      this.defaultImg = 'assets/imgs/ic_action_course.png';
      console.log('Inside content.defaultImg =>>', this.defaultImg);
    }*/
    this.defaultImg = 'assets/imgs/ic_action_course.png';
  }

  onImageLoad(imgLoader: ImageLoader) {
    console.log("Image Loader " + imgLoader.nativeAvailable);
  }
}
